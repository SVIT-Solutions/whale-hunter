from graphql import GraphQLError
from django.core.exceptions import ObjectDoesNotExist
from accounts.models import UserAPIKeys
from blockchains.models import Network
from django.core.cache import cache
import asyncio
import time


def create_error_response(message=None, place=None):
    return {
        "success": False,
        "error": {
            "message": message,
            "place": place
        }
    }


def cached_fetch(cache_key_template, func, success_cache_set_timeout, error_cache_set_timeout, *args, **kwargs):
    cache_key = cache_key_template.format(**kwargs)
    cached_result = cache.get(cache_key)

    if cached_result is not None:
        return cached_result
    else:
        result = func(*args, **kwargs)
        if result is None:
            if error_cache_set_timeout is not None:
                cache.set(cache_key, result, timeout=error_cache_set_timeout)
            return None
        if success_cache_set_timeout is not None:
            cache.set(cache_key, result, timeout=success_cache_set_timeout)
        return result


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


async def async_fetch_with_semaphore(semaphore, func, *args, **kwargs):
    async with semaphore:
        result = await asyncio.to_thread(func, *args, **kwargs)
        await asyncio.sleep(0.5)
        return result