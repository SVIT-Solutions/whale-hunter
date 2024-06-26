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

export const GET_WALLET_DATA = gql`
  query GetWalletData($walletAddress: String!, $network: String!, $blockExplorerApiKey: String!) {
    wallet(walletAddress: $walletAddress, network: $network, blockExplorerApiKey: $blockExplorerApiKey) {
      success
      transactions {
        fromAddress
        toAddress
        value
        tokenSymbol
        tokenName
        timeStamp
        contractAddress
      }
      tokenBalances {
        name
        symbol
        balance
        contractAddress
      }
      error {
        message
        place
      }
    }
  }
`;

export const GET_TOKEN_CONVERTED_PRICE = gql`
  query GetTokenConvertedPrice($tokenSymbol: String!, $convertSymbol: String, $coinmarketcapApiKey: String) {
    tokenConvertedPrice(
      tokenSymbol: $tokenSymbol
      convertSymbol: $convertSymbol
      coinmarketcapApiKey: $coinmarketcapApiKey
    ) {
      success
      tokenPrice
      error {
        message
        place
      }
    }
  }
`;

export const GET_TOKEN_CONVERTED_PRICES = gql`
  query GetTokenConvertedPrices($tokenSymbols: [String]!, $convertSymbol: String, $coinmarketcapApiKey: String) {
    tokenConvertedPrices(
      tokenSymbols: $tokenSymbols
      convertSymbol: $convertSymbol
      coinmarketcapApiKey: $coinmarketcapApiKey
    ) {
      success
      tokenPrices {
        symbol
        price
      }
      error {
        message
        place
      }
    }
  }
`;
