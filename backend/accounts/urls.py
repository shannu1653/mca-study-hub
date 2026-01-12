from django.urls import path
from .views import RegisterView, LoginView
from .views import ForgotPasswordView,ResetPasswordView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
]

urlpatterns += [
    path("forgot-password/", ForgotPasswordView.as_view()),
    path("reset-password/<uuid:token>/", ResetPasswordView.as_view()),
]