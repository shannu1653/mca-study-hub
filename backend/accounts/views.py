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

from .models import PasswordResetToken

User = get_user_model()


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        # ✅ 1. Validate email
        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ 2. Find user safely
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Email not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # ✅ 3. Delete old tokens
        PasswordResetToken.objects.filter(user=user).delete()

        # ✅ 4. Create new reset token
        reset_token = PasswordResetToken.objects.create(user=user)

        # ✅ 5. Build frontend reset link
        frontend_url = getattr(settings, "FRONTEND_URL", "").rstrip("/")
        reset_link = f"{frontend_url}/reset-password/{reset_token.token}"

        # ⚠️ For now return link (email sending comes next)
        return Response(
            {
                "message": "Password reset link generated",
                "reset_link": reset_link
            },
            status=status.HTTP_200_OK
        )


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        password = request.data.get("password")

        # ✅ 1. Validate password
        if not password:
            return Response(
                {"error": "Password is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ 2. Validate token
        try:
            reset_obj = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ 3. Reset password
        user = reset_obj.user
        user.set_password(password)
        user.save()

        # ✅ 4. Delete token after use
        reset_obj.delete()

        return Response(
            {"message": "Password reset successful"},
            status=status.HTTP_200_OK
        )
