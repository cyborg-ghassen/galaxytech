from django.contrib import admin
from django.contrib.admin.models import LogEntry

from .models import User


# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    filter_horizontal = ["groups", "user_permissions"]
    search_fields = [
        "username",
        "first_name",
        "last_name",
        "is_superuser",
        "is_staff",
        "is_active",
    ]
    list_display = [
        "username",
        "first_name",
        "last_name",
        "is_superuser",
        "is_staff",
        "is_active",
    ]
    list_filter = ["is_superuser", "is_staff", "is_active"]
    readonly_fields = ("date_joined", "updated_at", "last_login", "password")
    fieldsets = (
        (None, {'fields': ('username',
                           'password', ('first_name', 'last_name'))}),
        ('Contact', {
            # 'classes': ('collapse',),
            'fields': (('number', 'email'), )
        }),
        ('Biographical Details', {
            # 'classes': ('collapse',),
            'fields': ('avatar',)
        }),
        ('Permissions',
         {'fields': ('is_superuser', 'is_staff', 'is_active', 'groups')}),
        ('Time', {'fields': ('last_login', 'date_joined', 'updated_at')}),
    )
    add_fieldsets = (
        (None, {
            # 'classes': ('wide',),
            'fields': ('first_name',
                       'last_name',
                       'username',
                       'password1',
                       'password2')}
         ),
    )
    ordering = ('username',)


admin.site.register(LogEntry)
