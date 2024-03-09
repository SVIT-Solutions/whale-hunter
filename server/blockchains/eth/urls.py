from django.urls import path
from .views import *

urlpatterns = [
    path('get_wallet_data/', get_wallet_data, name='get_wallet_data'),
]