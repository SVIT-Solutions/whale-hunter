from django.urls import path
from .views import *


urlpatterns = [
  path('get_token_price/', get_token_price, name='get_token_price'),
  path('get_token_image/', get_token_image, name='get_token_image'),
]