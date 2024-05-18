import client from '@/graphql/client';
import { GET_WALLET_DATA } from '@/graphql/queries';
import { IWalletData } from '@/types';

interface FetchWalletDataParams {
  walletAddress: string;
  network: string;
  blockExplorerApiKey?: string;
}

export const fetchWalletData = async (variables: FetchWalletDataParams): Promise<IWalletData | null> => {
  try {
    const response = await client.query({
      query: GET_WALLET_DATA,
      variables,
    });
    const data = response.data.wallet;
    if (data.success) {
      return { transactions: data.transactions, tokenBalances: data.tokenBalances };
    }
  } catch (error) {
    return null;
  }
};
