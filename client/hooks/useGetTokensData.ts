import { useState } from 'react';

import { GET_TOKEN_IMAGE } from '@/graphql/queries';
import client from '@/graphql/client';
import { ITokenImages, ITokenPrices } from '@/types';
import { TokenImagesEnum } from '@/constants/tokens';
import { fetchWithRateLimit } from '@/utils';
import { fetchTokenConvertedPrice, fetchTokenConvertedPrices, fetchTokenImage } from '@/services/TokenService';

export const useGetTokensData = (coinmarketcapApiKey: string) => {
  const [isImagesLoading, setImagesLoading] = useState<boolean>(false);
  const [isPricesLoading, setPricesLoading] = useState<boolean>(false);

  const [images, setImages] = useState<ITokenImages | null>(null);
  const [prices, setPrices] = useState<ITokenPrices | null>(null);

  const getTokenImages = async (tokenSymbols: string[]) => {
    setImagesLoading(true);

    tokenSymbols = tokenSymbols
      .filter((tokenSymbol) => !tokenSymbol.includes(' '))
      .map((symbol) => symbol.toUpperCase());

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
      return fetchTokenImage(tokenSymbol, coinmarketcapApiKey);
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

      return setImages({ ...tokenImagesFromSessionStorage, ...combinedResult });
    } catch (error) {
      setImages(tokenImagesFromSessionStorage);
    } finally {
      setImagesLoading(false);
    }
  };

  const getTokenPrices = async (tokenSymbols: string[]) => {
    setPricesLoading(true);

    tokenSymbols = tokenSymbols.map((symbol) => symbol.toUpperCase());

    tokenSymbols = [...new Set(tokenSymbols)];

    try {
      const result = await fetchTokenConvertedPrices({ tokenSymbols, coinmarketcapApiKey });

      result.filter((token) => token.price !== null);

      const combinedResult = result.reduce((accumulator: ITokenPrices, currentObject) => {
        const { symbol, price } = currentObject;
        accumulator[symbol] = price;
        return accumulator;
      }, {});

      setPrices(combinedResult);
    } catch (error) {
      setPrices({});
    } finally {
      setPricesLoading(false);
    }
  };

  return {
    images,
    prices,
    pricesLoading: isPricesLoading,
    imagessLoading: isImagesLoading,
    getTokenImages,
    getTokenPrices,
  };
};
