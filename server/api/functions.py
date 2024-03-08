import requests

# Coinmarketcap API
def fetch_token_price_value(token_symbol=None, convert_symbol=None, api_key=None):
    if token_symbol is None or convert_symbol is None or api_key is None:
        return None

    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': api_key,
    }
    url = f'https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=1&symbol={token_symbol.upper()}&convert={convert_symbol.upper()}'

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


def fetch_token_image_url(token_symbol=None, api_key=None):
    if token_symbol is None or api_key is None:
        return None

    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': api_key,
    }
    url = f'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol={token_symbol.upper()}'

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            token_id = data['data'][token_symbol.upper()]['id']
            return f'https://s2.coinmarketcap.com/static/img/coins/64x64/{token_id}.png'
        else:
            return None
    except Exception as e:
        return None
