import graphene
from django.shortcuts import get_object_or_404
from accounts.models import UserAPIKeys
from graphql import GraphQLError
from .functions import fetch_token_price_value, fetch_token_image_url


class TokenImageType(graphene.ObjectType):
    success = graphene.Boolean()
    image_url = graphene.String()

class TokenPriceType(graphene.ObjectType):
    success = graphene.Boolean()
    convert_symbol = graphene.String()
    token_price = graphene.String()


class Query(graphene.ObjectType):
    token_price = graphene.Field(
        TokenPriceType, 
        token_symbol=graphene.String(), 
        convert_symbol=graphene.String(default_value="USDT"),
        description="Get converted token Price from Coinmarketcap API"
    )
    token_image = graphene.Field(
        TokenImageType,
        token_symbol=graphene.String(required=True),
        description="Get token Image from Coinmarketcap API"
    )

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