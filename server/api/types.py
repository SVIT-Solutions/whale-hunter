import graphene
from graphene_django.types import DjangoObjectType
from blockchains.models import Network

# GlobalTypes
class ErrorType(graphene.ObjectType):
    message = graphene.String()
    place = graphene.String()


# NetworkTypes
class NetworkType(DjangoObjectType):
    class Meta:
        model = Network


# Wallet Types
class TokenBalance(graphene.ObjectType):
    name = graphene.String()
    symbol = graphene.String()
    balance = graphene.Float()
    contract_address = graphene.String()

class TransactionType(graphene.ObjectType):
    from_address = graphene.String()
    to_address = graphene.String()
    value = graphene.String()
    tokenSymbol = graphene.String()
    tokenName = graphene.String()
    timeStamp = graphene.String()

class WalletType(graphene.ObjectType):
    success = graphene.Boolean()
    error = graphene.Field(ErrorType)
    token_balances = graphene.List(TokenBalance)
    transactions = graphene.List(TransactionType)
    warnings = graphene.List(graphene.String)


# Types for Coinmarketcap API Queries
class TokenImageType(graphene.ObjectType):
    success = graphene.Boolean()
    error = graphene.Field(ErrorType)
    image_url = graphene.String()

class TokenPriceType(graphene.ObjectType):
    success = graphene.Boolean()
    error = graphene.Field(ErrorType)
    token_price = graphene.String()