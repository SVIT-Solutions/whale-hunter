import graphene
from django.shortcuts import get_object_or_404
from graphql import GraphQLError
from graphene_django.types import DjangoObjectType
from django.utils.translation import gettext_lazy as _
import asyncio

from blockchains.models import Network
from .utils import *
from .functions import *
from .types import *
from .constants import cache_keys


class Query(graphene.ObjectType):
    networks = graphene.List(NetworkType)
    wallet = graphene.Field(
        WalletType,
        wallet_address=graphene.String(required=True),
        network=graphene.String(required=True),
        block_explorer_api_key=graphene.String(required=False),
        description="Get wallet data"
    )
    token_converted_prices = graphene.Field(
        TokenConvertedPricesType,
        token_symbols=graphene.List(graphene.String),
        convert_symbol=graphene.String(default_value="USDT"),
        coinmarketcap_api_key=graphene.String(required=False),
        description="Get token converted Prices from Coinmarketcap API"
    )
    token_converted_price = graphene.Field(
        TokenConvertedPriceType, 
        token_symbol=graphene.String(required=True),
        convert_symbol=graphene.String(default_value="USDT"),
        coinmarketcap_api_key=graphene.String(required=False),
        description="Get converted token Price from Coinmarketcap API"
    )
    token_price_info = graphene.Field(
        TokenPriceInfoType, 
        token_symbol=graphene.String(required=True),
        coinmarketcap_api_key=graphene.String(required=False),
        description="Get token Info from Coinmarketcap API"
    )
    token_image = graphene.Field(
        TokenImageType,
        token_symbol=graphene.String(required=True),
        coinmarketcap_api_key=graphene.String(required=False),
        description="Get token Image from Coinmarketcap API"
    )


    def resolve_networks(self, info):
        return Network.objects.all()


    def resolve_wallet(self, info, wallet_address, network, block_explorer_api_key=None):
        if block_explorer_api_key is not None:
            api_key = block_explorer_api_key
        else:
            # Check Authenticated
            user = info.context.user
            is_authenticated, authenticated_error = check_authenticated(user)
            if not is_authenticated:
                return create_error_response(message=authenticated_error, place="auth")

            # Get Etherscan API Key
            api_key, api_key_error = get_api_key(user=user, key="etherscan_api_key")

        if not api_key:
            return create_error_response(message=api_key_error, place="api_key")

        # Add functions class for current network
        functions_class_module, functions_class_module_error = get_functions_module(folder="functions_classes", network=network)
        if functions_class_module_error:
            return create_error_response(message=functions_class_module_error, place="network")
        FunctionsClass = getattr(functions_class_module, 'Functions')
        functions_instance = FunctionsClass(api_key)

        # Add requests params class for current network
        params_class_module, params_class_module_error = get_functions_module(folder="requests_params", network=network)
        if params_class_module_error:
            return create_error_response(message=params_class_module_error, place="network")
        ParamsClass = getattr(params_class_module, 'Params')
        params_instance = ParamsClass(api_key)

        # Checking the validity of the wallet address 
        is_address_valid = functions_instance.check_address_validity(wallet_address)
        if not is_address_valid:
            return create_error_response(message="The provided address '{wallet_address}' is not valid.", place="wallet_address")

        # Receiving Transactions
        fetch_wallet_transactins_params = params_instance.get_fetch_wallet_transactions_params(wallet_address=wallet_address)
        transactions, transactions_error = functions_instance.fetch_data_by_params(params=fetch_wallet_transactins_params, error_message='No transaction data found in the response')
        if transactions is None:
           return create_error_response(message=transactions_error, place='transactions')

        # Formatting Transaction Data
        formated_transactions = functions_instance.format_transactions_data(transactions)

        # Get Tokens Data from transactions
        tokens_data, tokens_data_error = get_tokens_data_from_transactions(formated_transactions)
        if tokens_data is None:
            return create_error_response(message=tokens_data_error, place='tokens_data')

        # Formatting contract_addresses for async_multiple_fetch_data_with_queue function
        contract_addresses = [{"contract_address": key} for key, value in tokens_data.items()]

        # Fetch token balances for each contract_adress
        token_balances_dict = asyncio.run(
            async_multiple_fetch_data_with_queue(
                functions_instance.fetch_token_balance_by_contract_adress, contract_addresses, "contract_address", wallet_address=wallet_address, params_instance=params_instance
            )
        )

        # Formatting Token Balances 
        token_balances = []
        for contract_address, data in tokens_data.items():
            token_balance = token_balances_dict.get(contract_address, "")

            if any(c.isdigit() or c == '.' for c in token_balance) and token_balance.count('.') <= 1:
                balance = float(token_balance) / 10 ** data.get('decimal', 1)
            else:
                balance = -1

            token_balances.append({
                "name": data.get('name', ''),
                "symbol": data.get('symbol', ''),
                "balance": balance,
                "contract_address": contract_address,
            })

        response_data = {
            "success": True,
            "token_balances": token_balances,
            "transactions": formated_transactions,
        }

        return response_data


    def resolve_token_converted_prices(self, info, token_symbols, convert_symbol, coinmarketcap_api_key=None):
        success = False

        if not token_symbols:
            return create_error_response(message='Token symbols not provided', place='token_symbol')

        if coinmarketcap_api_key is not None:
            api_key = coinmarketcap_api_key
        else:
            # Check Authenticated
            user = info.context.user
            is_authenticated, authenticated_error = check_authenticated(user)
            if not is_authenticated:
                return create_error_response(message=authenticated_error, place="auth")

            # Get Coinmarketcap API Key
            api_key, api_key_error = get_api_key(user=user, key="coinmarketcap_api_key")

        if not api_key:
            return create_error_response(message=api_key_error, place="api_key")

        requests_data = [{"token_symbol": symbol} for symbol in token_symbols]
        token_prices_dict = asyncio.run(
            async_multiple_fetch_data_with_queue(
                fetch_token_converted_price_value, requests_data, "token_symbol", api_key=api_key, convert_symbol=convert_symbol
            )
        )

        if token_prices_dict is None:
            return create_error_response(message='Could not find the token price', place='token_price')

        token_prices = [{"symbol": key, "price": value} for key, value in token_prices_dict.items()]

        return {'success': True, 'token_prices': token_prices}


    def resolve_token_converted_price(self, info, token_symbol, convert_symbol, coinmarketcap_api_key=None):
        success = False

        if not token_symbol:
            return create_error_response(message='Token symbol not provided', place='token_symbol')

        if coinmarketcap_api_key is not None:
            api_key = coinmarketcap_api_key
        else:
            # Check Authenticated
            user = info.context.user
            is_authenticated, authenticated_error = check_authenticated(user)
            if not is_authenticated:
                return create_error_response(message=authenticated_error, place="auth")

            # Get Coinmarketcap API Key
            api_key, api_key_error = get_api_key(user=user, key="coinmarketcap_api_key")

        if not api_key:
            return create_error_response(message=api_key_error, place="api_key")

        cache_key_template = cache_keys["token_converted_price"]
        token_price = cached_fetch(cache_key_template, fetch_token_converted_price_value, 60, None, api_key=api_key, token_symbol=token_symbol, convert_symbol=convert_symbol)

        if token_price is None:
            return create_error_response(message='Could not find the token price', place='token_price')

        return {'success': True, 'token_price': token_price}


    def resolve_token_price_info(self, info, token_symbol, coinmarketcap_api_key=None):
        success = False

        if not token_symbol:
            return create_error_response(message='Token symbol not provided', place='token_symbol')

        if coinmarketcap_api_key is not None:
            api_key = coinmarketcap_api_key
        else:
            # Check Authenticated
            user = info.context.user
            is_authenticated, authenticated_error = check_authenticated(user)
            if not is_authenticated:
                return create_error_response(message=authenticated_error, place="auth")

            # Get Coinmarketcap API Key
            api_key, api_key_error = get_api_key(user=user, key="coinmarketcap_api_key")

        if not api_key:
            return create_error_response(message=api_key_error, place="api_key")

        token_price_info = fetch_token_price_info(token_symbol=token_symbol, api_key=api_key)

        if token_price_info is None:
            return create_error_response(message='Could not find token information', place='token_price_info')

        return {
            "success": True, 
            "name": token_price_info['name'], 
            "symbol": token_price_info['symbol'],
            "token_price": token_price_info['quote']['USD']['price'],
            "percent_change_1h": token_price_info['quote']['USD']['percent_change_1h'],
            "percent_change_24h": token_price_info['quote']['USD']['percent_change_24h'],
            "percent_change_7d": token_price_info['quote']['USD']['percent_change_7d'],
            "percent_change_30d": token_price_info['quote']['USD']['percent_change_30d'],
            "percent_change_60d": token_price_info['quote']['USD']['percent_change_60d'],
            "percent_change_90d": token_price_info['quote']['USD']['percent_change_90d']
        }


    def resolve_token_image(self, info, token_symbol, coinmarketcap_api_key=None):
        if not token_symbol:
            return create_error_response(message='Token symbol not provided', place='token_symbol')

        if coinmarketcap_api_key is not None:
            api_key = coinmarketcap_api_key
        else:
            # Check Authenticated
            user = info.context.user
            is_authenticated, authenticated_error = check_authenticated(user)
            if not is_authenticated:
                return create_error_response(message=authenticated_error, place="auth")

            # Get Coinmarketcap API Key
            api_key, api_key_error = get_api_key(user=user, key="coinmarketcap_api_key")

        if not api_key:
            return create_error_response(message=api_key_error, place="api_key")

        cache_key_template = cache_keys["token_image"]
        image_url = cached_fetch(cache_key_template, fetch_token_image_url, 172800, 7200, api_key=api_key, token_symbol=token_symbol)

        if not image_url:
            return create_error_response(message='Failed to fetch token image', place='image_url')

        return {"success": True, "image_url": image_url}


schema = graphene.Schema(query=Query)