from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([AllowAny])   # 👈 FIX
def api_root(request):
    return Response({
        "auth": {
            "register": "/api/auth/register/",
            "login": "/api/auth/login/",
            "forgot_password": "/api/auth/forgot-password/",
            "reset_password": "/api/auth/reset-password/<uuid>/",
        },
        "notes": "/api/notes/",
        "admin": "/admin/",
    })

urlpatterns = [
    path("", api_root),
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/notes/", include("notes.urls")),
]
