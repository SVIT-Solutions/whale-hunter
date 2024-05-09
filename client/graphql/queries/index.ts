import gql from 'graphql-tag';

export const GET_TOKEN_IMAGE = gql`
  query GetTokenImage($tokenSymbol: String!, $coinmarketcapApiKey: String) {
    tokenImage(tokenSymbol: $tokenSymbol, coinmarketcapApiKey: $coinmarketcapApiKey) {
      success
      imageUrl
      error {
        message
        place
      }
    }
  }
`;
