import requests
from graphql import GraphQLError
from django.core.exceptions import ObjectDoesNotExist
from accounts.models import UserAPIKeys
from blockchains.models import Network
from django.core.cache import cache


# Coinmarketcap API
def fetch_token_converted_price_value(token_symbol=None, convert_symbol=None, api_key=None):
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


def fetch_token_price_info(token_symbol=None, api_key=None):
    if token_symbol is None or api_key is None:
        return None

    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': api_key,
    }
    url = f'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol={token_symbol.upper()}'

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            if 'data' in data and token_symbol.upper() in data['data']:
                return data['data'][token_symbol.upper()]
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


# Cached Coinmarketcap API
def cached_fetch_token_image_url(token_symbol, api_key):
    cache_key = f"token_image:{token_symbol}"
    cached_image_url = cache.get(cache_key)

    if cached_image_url is not None:
        return cached_image_url
    else:
        image_url = fetch_token_image_url(token_symbol, api_key)
        if image_url is None:
            cache.set(cache_key, image_url, timeout=3600)
            return None
        cache.set(cache_key, image_url, timeout=86400)
        return image_url


def cached_fetch_token_converted_price_value(token_symbol=None, convert_symbol="USDT", api_key=None):
    cache_key = f"token_converted_price:{token_symbol}:{convert_symbol}"
    cached_token_price = cache.get(cache_key)

    if cached_token_price is not None:
        return cached_token_price
    else:
        token_price = fetch_token_converted_price_value(token_symbol, convert_symbol, api_key)
        if token_price is None:
            return None
        cache.set(cache_key, token_price, timeout=60)
        return token_price


# API Functions
def check_authenticated(user):
    if not user.is_authenticated:
        return False, 'User is not authenticated'
    return True, None


def get_api_key(user, key):
    try:
        user_api_keys = UserAPIKeys.objects.get(user=user)
    except UserAPIKeys.DoesNotExist:
        return None, 'API Key not specified'

    api_key = getattr(user_api_keys, key, None)

    if not api_key:
        return None, 'API Key not specified'

    return api_key, None


def get_functions_module(folder=None, network=None):
    try:
        network = network.lower()
        Network.objects.get(abbreviation__iexact=network)
        functions_module = __import__(f"blockchains.{folder}.{network}", fromlist=["*"])
        return functions_module, None
    except ImportError:
        return None, f"Network {network} temporarily unavailable"
    except ObjectDoesNotExist:
        return None, f"Network {network} not supported"