from django.http import JsonResponse
from django.conf import settings
from .functions import *
from .utils import *


def get_wallet_balance(request):
    wallet_address = request.GET.get('wallet_address')

    if not is_valid_ethereum_address(wallet_address):
        return JsonResponse({'success': False, 'error': 'Wallet address is not valid'})

    api_key = settings.ETHERSCAN_API_KEY
    warnings = []

    latest_block = fetch_latest_block_number(api_key)

    if latest_block is None:
        latest_block = 999999999
        warnings.append({"place": "latest_block", "message": "Failed to get the latest block number"})

    token_balances, token_balances_error = fetch_token_balance(wallet_address, latest_block, api_key)

    if token_balances is None:
        return JsonResponse({'success': False, 'error': token_balances_error})

    response_data = {
        "success": True,
        "token_balances": token_balances,
        "warnings": warnings
    }

    return JsonResponse(response_data)