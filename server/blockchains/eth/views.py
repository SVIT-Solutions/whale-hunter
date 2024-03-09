from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from accounts.models import UserAPIKeys
from .functions import *
from .utils import *

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wallet_data(request):
    wallet_address = request.GET.get('wallet_address')

    if not is_valid_ethereum_address(wallet_address):
        return JsonResponse({'success': False, 'error': 'Wallet address is not valid'})

    user = request.user
    user_api_keys = get_object_or_404(UserAPIKeys, user=user)
    api_key = user_api_keys.etherscan_api_key

    warnings = []

    latest_block = fetch_latest_block_number(api_key=api_key)

    if latest_block is None:
        latest_block = 999999999
        warnings.append({"place": "latest_block", "message": "Failed to get the latest block number"})

    transactions, transactions_error = fetch_wallet_transactions(wallet_address=wallet_address, api_key=api_key, endblock=latest_block)

    if transactions is None:
        return JsonResponse({'success': False, 'error': transactions_error})

    token_balances, token_balances_error = calculate_token_balances(transactions, wallet_address)

    if token_balances is None:
        return JsonResponse({'success': False, 'error': token_balances_error})

    response_data = {
        "success": True,
        "token_balances": token_balances,
        "transactions": transactions,
        "warnings": warnings
    }

    return JsonResponse(response_data)