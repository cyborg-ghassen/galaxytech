from django.conf import settings
from rest_framework.permissions import BasePermission


class ViewAdmin(BasePermission):
    def has_permission(self, request, view):
        if request.user and settings.ADMIN_GROUP_NAME in \
                [obj.name for obj in request.user.groups.all()]:
            return True
        elif request.user and request.user.is_superuser:
            return True

        return False


class ViewUser(BasePermission):
    def has_permission(self, request, view):
        if request.user and settings.USER_GROUP_NAME in \
                [obj.name for obj in request.user.groups.all()]:
            return True
        elif request.user and request.user.is_staff:
            return True

        return False
