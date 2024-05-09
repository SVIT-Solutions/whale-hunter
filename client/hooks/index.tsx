import { useEffect, useState } from 'react';

import { useApolloClient } from '@apollo/client';
import { GET_TOKEN_IMAGE } from '@/graphql/queries';

interface GetTokenLogoParams {
  tokenSymbol: string;
  coinmarketcapApiKey?: string;
}

export function useGetTokenLogoPath({ tokenSymbol, coinmarketcapApiKey }: GetTokenLogoParams): string | null {
  const client = useApolloClient();

  const [tokenImage, setTokenImage] = useState<string | null>(null);

  const normalizedTokenSymbol = tokenSymbol.toUpperCase();

  const fetchTokenImageFromServer = () => {
    client
      .query({
        query: GET_TOKEN_IMAGE,
        variables: { tokenSymbol, coinmarketcapApiKey },
      })
      .then((result) => {
        const response = result.data.tokenImage;
        if (response.success) {
          const imageUrl = response.imageUrl;
          setTokenImage(imageUrl);
        }
      })
      .catch((error) => {});
  };

  const fetchTokenImageFromClient = () => {
    const tokenLocalPath = `/icons/tokens/${normalizedTokenSymbol}.logo.svg`;

    fetch(`..${tokenLocalPath}`)
      .then((result) => {
        if (result.ok) {
          setTokenImage(tokenLocalPath);
        } else {
          fetchTokenImageFromServer();
        }
      })
      .catch((error) => fetchTokenImageFromServer());
  };

  useEffect(() => {
    fetchTokenImageFromClient();

    return () => {
      setTokenImage(null);
    };
  }, [tokenSymbol]);

  return tokenImage;
}

const useInput = (initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const clearValue = () => {
    setValue('');
  };

  return {
    value,
    onChange: handleChange,
    clearValue,
  };
};

export default useInput;
