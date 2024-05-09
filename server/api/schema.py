import graphene
from django.shortcuts import get_object_or_404
from graphql import GraphQLError
from graphene_django.types import DjangoObjectType
from django.utils.translation import gettext_lazy as _

from blockchains.models import Network
from .utils import create_error_response
from .functions import *
from .types import *


class Query(graphene.ObjectType):
    networks = graphene.List(NetworkType)
    wallet = graphene.Field(
        WalletType,
        wallet_address=graphene.String(required=True),
        network=graphene.String(required=True),
        description="Get wallet data"
    )
    token_converted_price = graphene.Field(
        TokenPriceType, 
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
        transactions, transactions_error = functions_instance.fetch_transactions(fetch_wallet_transactins_params)
        if transactions is None:
           return create_error_response(message=transactions_error, place='transactions')

        # Calculating Token Balances
        token_balances, token_balances_error = functions_instance.calculate_token_balances(transactions)
        if token_balances is None:
            return create_error_response(message=token_balances_error, place='token_balances')

        # Formatting Transaction Data
        formated_transactions = functions_instance.format_transactions_data(transactions)

        response_data = {
            "success": True,
            "token_balances": token_balances,
            "transactions": formated_transactions,
        }

        return response_data


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

        token_price = fetch_token_converted_price_value(token_symbol=token_symbol, convert_symbol=convert_symbol, api_key=api_key)

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

        image_url = fetch_token_image_url(token_symbol=token_symbol, api_key=api_key)

        if not image_url:
            return create_error_response(message='Failed to fetch token image', place='image_url')

        return {"success": True, "image_url": image_url}


schema = graphene.Schema(query=Query)