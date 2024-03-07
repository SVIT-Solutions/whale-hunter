import requests
from django.conf import settings

# Coinmarketcap API
def get_token_price_value(token_symbol, convert_symbol):
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': settings.COINMARKETCAP_API_KEY,
    }
    url = f'https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=1&symbol={token_symbol}&convert={convert_symbol}'

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            if 'data' in data and 'quote' in data['data'] and 'USDT' in data['data']['quote']:
                return data['data']['quote']['USDT']['price']
            else:
                return None
        else:
            return None
    except Exception as e:
        return None
