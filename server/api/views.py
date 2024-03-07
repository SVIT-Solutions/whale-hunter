from django.http import JsonResponse
from .functions import get_token_price_value

# Create your views here.
def get_token_price(request):
    if request.method != 'GET':
        return JsonResponse({'success': False, 'error': 'Only GET method is allowed'})

    token_symbol = request.GET.get('token_symbol')
    convert_symbol = request.GET.get('convert_symbol', "USDT")

    if not token_symbol:
        return JsonResponse({'success': False, 'error': 'Token symbol not provided'})

    token_price = get_token_price_value(token_symbol, convert_symbol)
    if token_price is not None:
        return JsonResponse({'success': True, 'token_price': token_price, 'convert_symbol': convert_symbol})
    else:
        return JsonResponse({'success': False, 'error': 'Failed to fetch token price'})