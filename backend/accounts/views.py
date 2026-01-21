from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import RegisterSerializer, LoginSerializer
from .models import PasswordResetToken

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.save()
        tokens = get_tokens_for_user(user)

        return Response(
            {
                "message": "User registered successfully",
                "access": tokens["access"],
                "refresh": tokens["refresh"],
                "is_admin": user.is_staff,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"detail": "Invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = serializer.validated_data["user"]
        tokens = get_tokens_for_user(user)

        return Response(
            {
                "message": "Login successful",
                "access": tokens["access"],
                "refresh": tokens["refresh"],
                "is_admin": user.is_staff,
            },
            status=status.HTTP_200_OK,
        )


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        # Always return same response (security)
        response = {"message": "If email exists, reset link sent"}

        if not email:
            return Response(response)

        try:
            user = User.objects.get(email=email)

            PasswordResetToken.objects.filter(user=user).delete()
            reset = PasswordResetToken.objects.create(user=user)

            reset_link = f"{settings.FRONTEND_URL}/reset-password/{reset.token}"

            send_mail(
                subject="Reset your password",
                message=f"Click here to reset your password:\n{reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )
        except User.DoesNotExist:
            pass

        return Response(response)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        password = request.data.get("password")

        if not password:
            return Response(
                {"error": "Password required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            reset = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = reset.user
        user.set_password(password)
        user.save()
        reset.delete()

        return Response(
            {"message": "Password reset successful"},
            status=status.HTTP_200_OK
        )
