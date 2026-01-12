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
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from rest_framework.permissions import AllowAny
import uuid

User = get_user_model()

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]  # ✅ IMPORTANT

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
            return Response(
                {"error": "User with this email does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        reset_token = str(uuid.uuid4())
        user.reset_token = reset_token
        user.save()

        reset_link = f"https://mca-study-hub.onrender.com/reset-password/{reset_token}"

        send_mail(
            "Reset Your Password",
            f"Click the link to reset your password:\n{reset_link}",
            "noreply@mcastudyhub.com",
            [email],
            fail_silently=False,
        )

        return Response(
            {"message": "Password reset link sent to your email"},
            status=status.HTTP_200_OK
        )
