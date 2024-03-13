import graphene
from graphene_django.types import DjangoObjectType
from accounts.models import UserAPIKeys
from .functions import fetch_latest_block_number, fetch_wallet_transactions, calculate_token_balances, format_transactions_data
from graphql import GraphQLError


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



class Query:
    wallet = graphene.Field(
        WalletType,
        wallet_address=graphene.String(required=True),
        description="Get wallet data"
    )

    def resolve_wallet(self, info, wallet_address):
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

        latest_block = fetch_latest_block_number(api_key=api_key)
        if latest_block is None:
            latest_block = 999999999
            warnings.append("Failed to get the latest block number")

        transactions, transactions_error = fetch_wallet_transactions(wallet_address=wallet_address, api_key=api_key, endblock=latest_block)
        if transactions is None:
            raise GraphQLError(transactions_error)

        token_balances, token_balances_error = calculate_token_balances(transactions)
        if token_balances is None:
            raise GraphQLError(token_balances_error)

        formated_transactions = format_transactions_data(transactions)

        response_data = {
            "success": True,
            "token_balances": token_balances,
            "transactions": formated_transactions,
            "warnings": warnings
        }

        return response_data