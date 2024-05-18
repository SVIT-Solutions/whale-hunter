import client from '@/graphql/client';
import { GET_TOKEN_CONVERTED_PRICE, GET_TOKEN_CONVERTED_PRICES, GET_TOKEN_IMAGE } from '@/graphql/queries';

interface FetchTokenConvertedPriceParams {
  tokenSymbol: string;
  convertSymbol?: string;
  coinmarketcapApiKey?: string;
}
interface FetchTokenConvertedPricesParams {
  tokenSymbols: string[];
  convertSymbol?: string;
  coinmarketcapApiKey?: string;
}

export const fetchTokenConvertedPrice = async ({
  tokenSymbol,
  convertSymbol = 'USDT',
  coinmarketcapApiKey,
}: FetchTokenConvertedPriceParams) => {
  try {
    const response = await client.query({
      query: GET_TOKEN_CONVERTED_PRICE,
      variables: { tokenSymbol, convertSymbol, coinmarketcapApiKey },
    });

    const data = response.data.tokenConvertedPrice;

    if (data.success) {
      return { token: tokenSymbol, price: data.tokenPrice };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const fetchTokenConvertedPrices = async ({
  tokenSymbols,
  convertSymbol = 'USDT',
  coinmarketcapApiKey,
}: FetchTokenConvertedPricesParams) => {
  try {
    const response = await client.query({
      query: GET_TOKEN_CONVERTED_PRICES,
      variables: { tokenSymbols, convertSymbol, coinmarketcapApiKey },
    });

    const data = response.data.tokenConvertedPrices;

    if (data.success) {
      return data.tokenPrices;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const fetchTokenImage = async (tokenSymbol: string, coinmarketcapApiKey: string) => {
  try {
    const response = await client.query({
      query: GET_TOKEN_IMAGE,
      variables: { tokenSymbol, coinmarketcapApiKey },
    });
    const data = response.data.tokenImage;

    if (data.success) {
      return { token: tokenSymbol, image: data.imageUrl };
    }
  } catch (error) {
    return null;
  }
  return null;
};
