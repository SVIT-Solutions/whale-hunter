from django.contrib import admin
from .models import User, UserAPIKeys

admin.site.register(User)
admin.site.register(UserAPIKeys)