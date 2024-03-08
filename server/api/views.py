from django.http import JsonResponse
from .functions import fetch_token_price_value, fetch_token_image_url

# Create your views here.
def get_token_price(request):
    if request.method != 'GET':
        return JsonResponse({'success': False, 'error': 'Only GET method is allowed'})

    token_symbol = request.GET.get('token_symbol')
    convert_symbol = request.GET.get('convert_symbol', "USDT")

    if not token_symbol:
        return JsonResponse({'success': False, 'error': 'Token symbol not provided'})

    token_price = fetch_token_price_value(token_symbol, convert_symbol)
    if token_price is not None:
        return JsonResponse({'success': True, 'token_price': token_price, 'convert_symbol': convert_symbol})
    else:
        return JsonResponse({'success': False, 'error': 'Failed to fetch token price'})


def get_token_image(request):
    token_symbol = request.GET.get('token_symbol')

    if not token_symbol:
        return JsonResponse({'error': 'Token symbol is missing in the request'}, status=400)

    image_url = fetch_token_image_url(token_symbol)

    if image_url:
        return JsonResponse({'image_url': image_url})
    else:
        return JsonResponse({'error': 'Failed to fetch token image'}, status=500)
