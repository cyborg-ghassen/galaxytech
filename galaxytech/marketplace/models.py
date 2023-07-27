from django.db import models


# Create your models here.
class Marketplace(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(default=None, null=True, blank=True, upload_to="logo")
    phone = models.CharField(max_length=100)
    email = models.EmailField()
    address = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
