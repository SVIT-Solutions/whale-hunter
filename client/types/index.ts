export interface IThemeColors {
  [key: string]: string;
}

export interface ITokenImages {
  [key: string]: string;
}

export interface ITokenPrices {
  [key: string]: number;
}

export interface ITokenData {
  image?: string;
  price?: number;
}

export interface IToken {
  [key: string]: ITokenData;
}

export interface IWalletTransactions {
  fromAddress: string;
  toAddress: string;
  value: string;
  tokenSymbol: string;
  tokenName: string;
  timeStamp: string;
}

export interface IWalletTokenBalances {
  name: string;
  symbol: string;
  balance: number;
  contractAddress: string | null;
}

export interface IWalletData {
  transactions: IWalletTransactions[];
  tokenBalances: IWalletTokenBalances[];
}
