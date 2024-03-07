from django.urls import path
from .views import *

urlpatterns = [
    path('get_wallet_balance/', get_wallet_balance, name='get_wallet_balance'),
]