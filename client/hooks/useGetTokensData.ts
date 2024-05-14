import { useState } from 'react';

import { GET_TOKEN_CONVERTED_PRICE, GET_TOKEN_IMAGE } from '@/graphql/queries';
import client from '@/graphql/client';
import { ITokenImages, ITokenPrices } from '@/types';
import { TokenImagesEnum } from '@/constants/tokens';

export const useGetTokensData = (coinmarketcapApiKey: string) => {
  const [isImagesLoading, setImagesLoading] = useState<boolean>(false);
  const [isPricesLoading, setPricesLoading] = useState<boolean>(false);

  const [tokenImages, setTokenImages] = useState<ITokenImages | null>(null);
  const [tokenPrices, setTokenPrices] = useState<ITokenPrices | null>(null);

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
    setImagesLoading(true);

    tokenSymbols = tokenSymbols
      .map((tokenSymbol) => tokenSymbol.toUpperCase())
      .filter((tokenSymbol) => !tokenSymbol.includes(' '));

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

      setTokenImages({ ...tokenImagesFromSessionStorage, ...combinedResult });
    } catch (error) {
      setTokenImages(tokenImagesFromSessionStorage);
    } finally {
      setImagesLoading(false);
    }
  };

  const getTokenPrices = async (tokenSymbols: string[]) => {
    setPricesLoading(true);
    tokenSymbols = tokenSymbols.map((tokenSymbol) => tokenSymbol.toUpperCase());

    const promises = tokenSymbols.map((tokenSymbol) => {
      return fetchTokenConvertedPrice(tokenSymbol);
    });

    try {
      let results = await Promise.all(promises);

      results = results.filter((result) => result !== null);

      const combinedResult = results.reduce((accumulator: ITokenPrices, currentObject) => {
        const { token, price } = currentObject;
        accumulator[token] = price;
        return accumulator;
      }, {});
      setTokenPrices(combinedResult);
    } catch (error) {
    } finally {
      setPricesLoading(false);
    }
  };

  return {
    images: tokenImages,
    prices: tokenPrices,
    imagesLoading: isImagesLoading,
    pricesLoading: isPricesLoading,
    getImages: getTokenImages,
    getPrices: getTokenPrices,
  };
};
