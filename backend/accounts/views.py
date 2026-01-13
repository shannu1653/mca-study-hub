from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

from .serializers import RegisterSerializer, LoginSerializer


class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "message": "User registered successfully",
                "token": token.key
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "message": "Login successful",
                "token": token.key,
                "is_admin": user.is_staff
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail

from .models import PasswordResetToken

User = get_user_model()


# =========================
# FORGOT PASSWORD (SEND LINK)
# =========================
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Security: don't reveal user existence
            return Response(
                {"message": "If email exists, reset link sent"},
                status=status.HTTP_200_OK
            )

        # Delete old tokens
        PasswordResetToken.objects.filter(user=user).delete()

        # Create new token
        reset_token = PasswordResetToken.objects.create(user=user)

        frontend_url = settings.FRONTEND_URL.rstrip("/")
        reset_link = f"{frontend_url}/reset-password/{reset_token.token}"

        # Send email (PLAIN TEXT)
        send_mail(
            subject="Reset your MCA Study password",
            message=f"""
Hello {user.email},

You requested a password reset.

Click the link below to reset your password:
{reset_link}

If you did not request this, ignore this email.

– MCA Study Team
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response(
            {"message": "Password reset link sent"},
            status=status.HTTP_200_OK
        )


# =========================
# RESET PASSWORD (FROM REACT)
# =========================
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        password = request.data.get("password")

        if not password:
            return Response(
                {"error": "Password is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            reset_obj = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = reset_obj.user
        user.set_password(password)
        user.save()

        # One-time use token
        reset_obj.delete()

        return Response(
            {"message": "Password reset successful"},
            status=status.HTTP_200_OK
        )
