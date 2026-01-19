from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, LoginSerializer
from .models import PasswordResetToken

User = get_user_model()


# =========================
# REGISTER
# =========================
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "User registered successfully",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# LOGIN
# =========================
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Login successful",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "is_admin": user.is_staff,
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# FORGOT PASSWORD (SEND LINK)
# =========================
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def options(self, request, *args, **kwargs):
        return Response(status=status.HTTP_200_OK)

    def post(self, request):
        email = request.data.get("email")

        # Always return success (security)
        if not email:
            return Response(
                {"message": "If email exists, reset link sent"},
                status=status.HTTP_200_OK,
            )

        try:
            user = User.objects.get(email=email)

            PasswordResetToken.objects.filter(user=user).delete()
            reset_token = PasswordResetToken.objects.create(user=user)

            frontend_url = settings.FRONTEND_URL.rstrip("/")
            reset_link = f"{frontend_url}/reset-password/{reset_token.token}"

            try:
                send_mail(
                    subject="Reset your MCA Study password",
                    message=(
                        "Hello,\n\n"
                        "You requested a password reset.\n\n"
                        f"Click the link below:\n{reset_link}\n\n"
                        "If you did not request this, ignore this email.\n\n"
                        "– MCA Study Team"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True,  # ✅ IMPORTANT FOR LIVE
                )
            except Exception:
                pass

        except User.DoesNotExist:
            pass

        return Response(
            {"message": "If email exists, reset link sent"},
            status=status.HTTP_200_OK,
        )


# =========================
# RESET PASSWORD
# =========================
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        password = request.data.get("password")

        if not password:
            return Response(
                {"error": "Password is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            reset_obj = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = reset_obj.user
        user.set_password(password)
        user.save()

        reset_obj.delete()

        return Response(
            {"message": "Password reset successful"},
            status=status.HTTP_200_OK,
        )
