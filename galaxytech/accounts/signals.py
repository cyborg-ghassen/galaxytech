from django.conf import settings
from django.contrib.auth.models import Group
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User


@receiver(post_save, sender=User)
def update_user_profile(sender, instance, created, **kwargs):
    if created:
        group, created = Group.objects.get_or_create(name=settings.USER_GROUP_NAME)
        instance.groups.add(group)
        instance.save()
