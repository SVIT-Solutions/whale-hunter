export interface IThemeColors {
  [key: string]: string;
}

export interface ITokenImages {
  [key: string]: string;
}

export interface ITokenPrices {
  [key: string]: number;
}

export interface IWalletTransactions {
  fromAddress: string;
  toAddress: string;
  value: string;
  tokenSymbol: string;
  tokenName: string;
  timeStamp: string;
  contractAddress: string;
}

export interface IWalletTokenBalances {
  name: string;
  symbol: string;
  balance: number;
  contractAddress: string;
}

export interface IWalletData {
  transactions: IWalletTransactions[];
  tokenBalances: IWalletTokenBalances[];
}
