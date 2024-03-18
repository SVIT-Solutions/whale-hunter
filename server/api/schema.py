import graphene
from django.shortcuts import get_object_or_404
from graphql import GraphQLError
from graphene_django.types import DjangoObjectType
from django.utils.translation import gettext_lazy as _

from blockchains.models import Network
from .utils import create_error_response
from .functions import fetch_token_price_value, fetch_token_image_url, get_api_key, get_functions_module, check_authenticated
from .types import *


class Query(graphene.ObjectType):
    networks = graphene.List(NetworkType)
    wallet = graphene.Field(
        WalletType,
        wallet_address=graphene.String(required=True),
        network=graphene.String(required=True),
        description="Get wallet data"
    )
    token_price = graphene.Field(
        TokenPriceType, 
        token_symbol=graphene.String(required=True),
        convert_symbol=graphene.String(default_value="USDT"),
        description="Get converted token Price from Coinmarketcap API"
    )
    token_image = graphene.Field(
        TokenImageType,
        token_symbol=graphene.String(required=True),
        description="Get token Image from Coinmarketcap API"
    )


    def resolve_networks(self, info):
        return Network.objects.all()


    def resolve_wallet(self, info, wallet_address, network):
        # Check Authenticated
        user = info.context.user
        is_authenticated, authenticated_error = check_authenticated(user)
        if not is_authenticated:
            return create_error_response(message=authenticated_error, place="auth")

        # Get Etherscan API Key
        api_key, api_key_error = get_api_key(user=user, key="etherscan_api_key")
        if not api_key:
            return create_error_response(message=api_key_error, place="api_key")

        warnings = []

        # Checking if the network is supported or correct
        functions_module, functions_module_error = get_functions_module(network)
        if functions_module is None:
            return create_error_response(message=functions_module_error, place="network")

        # Checking the validity of the wallet address 
        validate_address_function = getattr(functions_module, 'check_address_validity')
        is_address_valid = validate_address_function(wallet_address)
        if not is_address_valid:
            raise GraphQLError(f"The provided address '{wallet_address}' is not valid.")

        # Getting the Last Block
        latest_block_function = getattr(functions_module, 'fetch_latest_block_number')
        latest_block = latest_block_function(api_key=api_key)
        if latest_block is None:
            latest_block = 999999999
            warnings.append("Failed to get the latest block number")

        # Receiving Transactions
        fetch_transactions_function = getattr(functions_module, 'fetch_wallet_transactions')
        transactions, transactions_error = fetch_transactions_function(wallet_address=wallet_address, api_key=api_key, endblock=latest_block)
        if transactions is None:
            raise GraphQLError(transactions_error)

        # Calculating Token Balances
        calculate_balances_function = getattr(functions_module, 'calculate_token_balances')
        token_balances, token_balances_error = calculate_balances_function(transactions)
        if token_balances is None:
            raise GraphQLError(token_balances_error)

        # Formatting Transaction Data
        format_transactions_function = getattr(functions_module, 'format_transactions_data')
        formated_transactions = format_transactions_function(transactions)

        response_data = {
            "success": True,
            "token_balances": token_balances,
            "transactions": formated_transactions,
            "warnings": warnings
        }

        return response_data


    def resolve_token_price(self, info, token_symbol, convert_symbol):
        success = False
        user = info.context.user

        if not token_symbol:
            return create_error_response(message='Token symbol not provided', place='token_symbol')

        # Check Authenticated
        user = info.context.user
        is_authenticated, authenticated_error = check_authenticated(user)
        if not is_authenticated:
            return create_error_response(message=authenticated_error, place="auth")

        # Get Coinmarketcap API Key
        api_key, api_key_error = get_api_key(user=user, key="coinmarketcap_api_key")
        if not api_key:
            return create_error_response(message=api_key_error, place="api_key")

        token_price = fetch_token_price_value(token_symbol=token_symbol, convert_symbol=convert_symbol, api_key=api_key)

        if token_price is None:
            return create_error_response(message='Could not find the token price', place='token_price')

        return {'success': True, 'token_price': token_price}


    def resolve_token_image(self, info, token_symbol):
        user = info.context.user

        if not token_symbol:
            return create_error_response(message='Token symbol not provided', place='token_symbol')

        # Check Authenticated
        user = info.context.user
        is_authenticated, authenticated_error = check_authenticated(user)
        if not is_authenticated:
            return create_error_response(message=authenticated_error, place="auth")

        # Get Coinmarketcap API Key
        api_key, api_key_error = get_api_key(user=user, key="coinmarketcap_api_key")
        if not api_key:
            return create_error_response(message=api_key_error, place="api_key")

        image_url = fetch_token_image_url(token_symbol=token_symbol, api_key=api_key)

        if not image_url:
            return create_error_response(message='Failed to fetch token image', place='image_url')

        return {"success": True, "image_url": image_url}


schema = graphene.Schema(query=Query)