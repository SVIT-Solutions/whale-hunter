from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from accounts.models import UserAPIKeys
from .functions import fetch_token_price_value, fetch_token_image_url


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_token_price(request):
    user = request.user
    user_api_keys = get_object_or_404(UserAPIKeys, user=user)
    api_key = user_api_keys.coinmarketcap_api_key

    token_symbol = request.GET.get('token_symbol')
    convert_symbol = request.GET.get('convert_symbol', "USDT")

    if not token_symbol:
        return JsonResponse({'success': False, 'error': 'Token symbol not provided'})

    token_price = fetch_token_price_value(token_symbol=token_symbol, convert_symbol=convert_symbol, api_key=api_key)

    if token_price is not None:
        return JsonResponse({'success': True, 'token_price': token_price, 'convert_symbol': convert_symbol})
    else:
        return JsonResponse({'success': False, 'error': 'Failed to fetch token price'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_token_image(request):
    user = request.user
    user_api_keys = get_object_or_404(UserAPIKeys, user=user)
    api_key = user_api_keys.coinmarketcap_api_key

    token_symbol = request.GET.get('token_symbol')

    if not token_symbol:
        return JsonResponse({'error': 'Token symbol is missing in the request'}, status=400)

    image_url = fetch_token_image_url(token_symbol=token_symbol, api_key=api_key)

    if image_url:
        return JsonResponse({'image_url': image_url})
    else:
        return JsonResponse({'error': 'Failed to fetch token image'}, status=500)
