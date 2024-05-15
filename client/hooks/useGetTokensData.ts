import { useState } from 'react';

import { GET_TOKEN_CONVERTED_PRICE, GET_TOKEN_IMAGE } from '@/graphql/queries';
import client from '@/graphql/client';
import { IToken, ITokenImages, ITokenPrices } from '@/types';
import { TokenImagesEnum } from '@/constants/tokens';
import { fetchWithRateLimit } from '@/utils';

interface IGetTokensDataOptions {
  images?: boolean;
  prices?: boolean;
}

export const useGetTokensData = (coinmarketcapApiKey: string) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const [tokens, setTokens] = useState<IToken | null>(null);

  const fetchTokenImageFromServer = async (tokenSymbol: string) => {
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

  const fetchTokenConvertedPrice = async (tokenSymbol: string, convertSymbol: string = 'USDT') => {
    try {
      const response = await client.query({
        query: GET_TOKEN_CONVERTED_PRICE,
        variables: { tokenSymbol, coinmarketcapApiKey, convertSymbol },
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

  const getTokenImages = async (tokenSymbols: string[]) => {
    tokenSymbols = tokenSymbols.filter((tokenSymbol) => !tokenSymbol.includes(' '));

    tokenSymbols = [...new Set(tokenSymbols)];

    const tokenImagesFromSessionStorage: ITokenImages = {};

    // Check token images from sessionStorage
    tokenSymbols.forEach((tokenSymbol) => {
      const savedTokenImage = sessionStorage.getItem(tokenSymbol);
      if (savedTokenImage) {
        tokenImagesFromSessionStorage[tokenSymbol] = savedTokenImage;
      }
    });

    tokenSymbols = tokenSymbols.filter((tokenSymbol) => !tokenImagesFromSessionStorage.hasOwnProperty(tokenSymbol));

    // Fetch unavailable token images
    const promises = tokenSymbols.map((tokenSymbol) => {
      if (tokenSymbol in TokenImagesEnum) {
        return { token: tokenSymbol, image: TokenImagesEnum[tokenSymbol] };
      }
      return fetchTokenImageFromServer(tokenSymbol);
    });

    try {
      let results = await Promise.all(promises);

      results = results.filter((result) => result !== null);

      results.forEach((result) => {
        if (result.image) {
          sessionStorage.setItem(result.token, result.image);
        }
      });

      const combinedResult = results.reduce((accumulator: ITokenImages, currentObject) => {
        const { token, image } = currentObject;
        accumulator[token] = image;
        return accumulator;
      }, {});

      return { ...tokenImagesFromSessionStorage, ...combinedResult };
    } catch (error) {
      return tokenImagesFromSessionStorage;
    }
  };

  const getTokenPrices = async (tokenSymbols: string[]) => {
    try {
      let results = await fetchWithRateLimit(fetchTokenConvertedPrice, tokenSymbols);

      results = results.filter((result) => result !== null);

      const combinedResult = results.reduce((accumulator: ITokenPrices, currentObject) => {
        const { token, price } = currentObject;
        accumulator[token] = price;
        return accumulator;
      }, {});

      return combinedResult;
    } catch (error) {
      return {};
    }
  };

  const getTokensData = async (tokenSymbols: string[], options: IGetTokensDataOptions) => {
    setLoading(true);

    tokenSymbols = tokenSymbols.map((tokenSymbol) => tokenSymbol.toUpperCase());

    const images = options?.images ? (await getTokenImages(tokenSymbols)) || {} : {};
    const prices = options?.prices ? (await getTokenPrices(tokenSymbols)) || {} : {};

    const mergedTokenData: IToken = {};

    for (const key in images) {
      mergedTokenData[key] = { image: images[key] };
      if (prices[key] !== undefined) {
        mergedTokenData[key].price = prices[key];
      }
    }

    setTokens(mergedTokenData);

    setLoading(false);
  };

  return {
    tokens: tokens,
    loading: isLoading,
    getTokensData: getTokensData,
  };
};
