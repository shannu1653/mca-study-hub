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


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"message": "If email exists, reset link sent"})

        try:
            user = User.objects.get(email=email)
            PasswordResetToken.objects.filter(user=user).delete()
            reset = PasswordResetToken.objects.create(user=user)

            reset_link = f"{settings.FRONTEND_URL}/reset-password/{reset.token}"

            send_mail(
                "Reset your password",
                f"Click here to reset your password:\n{reset_link}",
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )
        except User.DoesNotExist:
            pass

        return Response({"message": "If email exists, reset link sent"})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        password = request.data.get("password")
        if not password:
            return Response({"error": "Password required"}, status=400)

        try:
            reset = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response({"error": "Invalid token"}, status=400)

        user = reset.user
        user.set_password(password)
        user.save()
        reset.delete()

        return Response({"message": "Password reset successful"})
