from django.urls import path

from accounts.api.viewsets import SetCSRFCookie
from rest_framework.routers import DefaultRouter

from .viewsets import RegistrationViewSet, UserViewSet, GroupViewSet

router = DefaultRouter()
router.register("auth/register", RegistrationViewSet, basename="register")
router.register("user", UserViewSet, basename="user")
router.register("group", GroupViewSet, basename="group")

urlpatterns = [
    *router.urls,
    path('setcsrf/', SetCSRFCookie.as_view(), name='setcsrf'),
]
