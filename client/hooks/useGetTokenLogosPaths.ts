import { useState } from 'react';

import { GET_TOKEN_IMAGE } from '@/graphql/queries';
import client from '@/graphql/client';
import { ITokenImages } from '@/types';

export const useGetTokenLogosPaths = (coinmarketcapApiKey: string) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [tokenImages, setTokenImages] = useState<ITokenImages | null>(null);

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
    } catch (error) {}
    return null;
  };

  const fetchTokenImageFromClient = async (tokenSymbol: string) => {
    const tokenLocalPath = `/icons/tokens/${tokenSymbol}.logo.svg`;

    try {
      const response = await fetch(`..${tokenLocalPath}`);

      if (response.ok) {
        return { token: tokenSymbol, image: tokenLocalPath };
      } else {
        return await fetchTokenImageFromServer(tokenSymbol);
      }
    } catch (error) {
      return await fetchTokenImageFromServer(tokenSymbol);
    }
  };

  const getTokenImages = async (tokenSymbols: string[]) => {
    setLoading(true);

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
      return fetchTokenImageFromClient(tokenSymbol);
    });

    try {
      const results = await Promise.all(promises);

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
      setLoading(false);
    }
  };

  return { images: tokenImages, loading: isLoading, getImages: getTokenImages };
};
