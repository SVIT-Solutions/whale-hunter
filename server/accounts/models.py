from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from .managers import UserManager, UserManagerAll


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)

    objects = UserManager()

    objects_all = UserManagerAll()

    USERNAME_FIELD = "email"
    
    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        ordering = ["-id"]


class UserAPIKeys(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    coinmarketcap_api_key = models.CharField(max_length=100)
    etherscan_api_key = models.CharField(max_length=100)
    
    def __str__(self):
        return self.user.email