import graphene
from django.shortcuts import get_object_or_404
from graphql import GraphQLError
from django.core.exceptions import ObjectDoesNotExist
from graphene_django.types import DjangoObjectType
from django.utils.translation import gettext_lazy as _

from accounts.models import UserAPIKeys
from blockchains.models import Network
from .functions import fetch_token_price_value, fetch_token_image_url


class NetworkType(DjangoObjectType):
    class Meta:
        model = Network


# Wallet Types
class TokenBalance(graphene.ObjectType):
    name = graphene.String()
    symbol = graphene.String()
    balance = graphene.Float()
    contract_address = graphene.String()

class Transaction(graphene.ObjectType):
    from_address = graphene.String()
    to_address = graphene.String()
    value = graphene.String()
    tokenSymbol = graphene.String()
    tokenName = graphene.String()
    timeStamp = graphene.String()

class WalletType(graphene.ObjectType):
    success = graphene.Boolean()
    token_balances = graphene.List(TokenBalance)
    transactions = graphene.List(Transaction)
    warnings = graphene.List(graphene.String)


# Types for Coinmarketcap API Queries
class TokenImageType(graphene.ObjectType):
    success = graphene.Boolean()
    image_url = graphene.String()

class TokenPriceType(graphene.ObjectType):
    success = graphene.Boolean()
    convert_symbol = graphene.String()
    token_price = graphene.String()


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
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError('User is not authenticated')

        try:
            user_api_keys = UserAPIKeys.objects.get(user=user)
            api_key = user_api_keys.etherscan_api_key
        except:
            raise GraphQLError('API Key not specified')

        if not api_key:
            raise GraphQLError('API Key not specified')

        warnings = []

        # Checking if the network is supported or correct
        try:
            network = network.lower()
            Network.objects.get(abbreviation__iexact=network)
            functions_module = __import__(f"blockchains.functions.{network}", fromlist=["*"])
        except ImportError:
            raise GraphQLError(f"Network {network} temporarily unavailable")
        except ObjectDoesNotExist:
            raise GraphQLError(f"Network {network} not supported")

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
        user_api_keys = get_object_or_404(UserAPIKeys, user=user)
        api_key = user_api_keys.coinmarketcap_api_key

        token_price = fetch_token_price_value(token_symbol=token_symbol, convert_symbol=convert_symbol, api_key=api_key)

        if token_price is not None:
            success = True

        return {'success': success, 'token_price': token_price, 'convert_symbol': convert_symbol}


    def resolve_token_image(self, info, token_symbol):
        success = False
        user = info.context.user
        user_api_keys = get_object_or_404(UserAPIKeys, user=user)
        api_key = user_api_keys.coinmarketcap_api_key

        if not token_symbol:
            raise GraphQLError('Token symbol not provided')

        image_url = fetch_token_image_url(token_symbol=token_symbol, api_key=api_key)

        if image_url:
            success = True
        else:
            raise GraphQLError('Failed to fetch token image')

        return {"success": success, "image_url": image_url}

schema = graphene.Schema(query=Query)