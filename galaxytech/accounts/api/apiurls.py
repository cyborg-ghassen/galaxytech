from django.urls import path

from .viewsets import SetCSRFCookie, PermissionViewSet
from rest_framework.routers import DefaultRouter

from .viewsets import RegistrationViewSet, UserViewSet, GroupViewSet

router = DefaultRouter()
router.register("auth/register", RegistrationViewSet, basename="register")
router.register("user", UserViewSet, basename="user")
router.register("group", GroupViewSet, basename="group")
router.register("permission", PermissionViewSet, basename="permission")

urlpatterns = [
    *router.urls,
    path('setcsrf/', SetCSRFCookie.as_view(), name='setcsrf'),
]
