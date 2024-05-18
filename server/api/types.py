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
    decimal = graphene.Int()

class TransactionType(graphene.ObjectType):
    from_address = graphene.String()
    to_address = graphene.String()
    value = graphene.String()
    tokenSymbol = graphene.String()
    tokenDecimal = graphene.Int()
    tokenName = graphene.String()
    timeStamp = graphene.String()
    contractAddress = graphene.String()

class WalletType(graphene.ObjectType):
    success = graphene.Boolean()
    error = graphene.Field(ErrorType)
    token_balances = graphene.List(TokenBalance)
    transactions = graphene.List(TransactionType)


# Types for Coinmarketcap API Queries
class TokenImageType(graphene.ObjectType):
    success = graphene.Boolean()
    error = graphene.Field(ErrorType)
    image_url = graphene.String()

class TokenPriceInfoType(graphene.ObjectType):
    success = graphene.Boolean()
    error = graphene.Field(ErrorType)
    name = graphene.String()
    symbol = graphene.String()
    token_price = graphene.Float()
    percent_change_1h = graphene.Float()
    percent_change_24h = graphene.Float()
    percent_change_7d = graphene.Float()
    percent_change_30d = graphene.Float()
    percent_change_60d = graphene.Float()
    percent_change_90d = graphene.Float()

class TokenPriceType(graphene.ObjectType):
    symbol = graphene.String()
    price = graphene.Float()

class TokenConvertedPricesType(graphene.ObjectType):
    success = graphene.Boolean()
    error = graphene.Field(ErrorType)
    token_prices = graphene.List(TokenPriceType)

class TokenConvertedPriceType(graphene.ObjectType):
    success = graphene.Boolean()
    error = graphene.Field(ErrorType)
    token_price = graphene.String()
