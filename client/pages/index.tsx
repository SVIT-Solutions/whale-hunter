import React, { useEffect, useMemo, useState } from 'react';
import { Box, Card, Grid, Theme, Typography } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';

import RoundedIconButton from '@/components/buttons/RoundedIconButton';
import HorizontalSeparator from '@/components/separators/HorizontalSeparator';
import ButtonRoot from '@/components/buttons/ButtonRoot';
import ResourcesLink from '@/components/links/ResourcesLink';
import SearchByBlockchain from '@/components/searches/SearchByBlockchain';
import XLogo from '@/assets/icons/X.logo';
import GitHubLogo from '@/assets/icons/GitHub.logo';
import InputRoot from '@/components/inputs/InputRoot';
import { useApolloClient } from '@apollo/client';
import { GET_WALLET_DATA } from '@/graphql/queries';
import { useGetTokensData } from '@/hooks/useGetTokensData';
import { IWalletData } from '@/types';
import TableRoot from '@/components/tables/TableRoot';
import { useZoomLevel } from '@/hooks/useZoomLevel';
import { formatNumber } from '@/utils';

interface Props {
  children?: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: { height: '100vh' },
  card: {
    height: '100%',
    borderRadius: 0,
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  apiKeysSettingsImage: {
    margin: '50px 0',
  },
}));

const Home = ({ children }: Props) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  const client = useApolloClient();

  const zoomLevel = useZoomLevel();

  const [coinmarketcapApiKey, setCoinmarketcapApiKey] = useState<string>('');
  const [blockExplorerApiKey, setBlockExplorerApiKey] = useState<string>('');

  const [coinmarketcapApiKeyError, setCoinmarketcapApiKeyError] = useState<boolean>(false);
  const [blockExplorerApiKeyError, setBlockExplorerApiKeyError] = useState<boolean>(false);

  const { tokens, getTokensData } = useGetTokensData(coinmarketcapApiKey);

  const [walletData, setWalletData] = useState<IWalletData | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isSearchDisabled = coinmarketcapApiKey?.length < 32 || blockExplorerApiKey?.length < 32;

  const searchPlaceholderText = isSearchDisabled
    ? 'Enter your api keys to start scanning'
    : 'Search by wallet or contract address';

  // fetch requests
  const fetchWalletData = async (walletAddress: string): Promise<IWalletData | null> => {
    try {
      const response = await client.query({
        query: GET_WALLET_DATA,
        variables: { walletAddress: walletAddress, network: 'eth', blockExplorerApiKey },
      });
      const data = response.data.wallet;
      if (data.success) {
        return { transactions: data.transactions, tokenBalances: data.tokenBalances };
      }
    } catch (error) {
      return null;
    }
  };

  // API Keys Inputs change handlers
  const handleCoinmarketcapApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCoinmarketcapApiKey(event.target.value as string);
    if (coinmarketcapApiKeyError) {
      setCoinmarketcapApiKeyError(false);
    }
  };

  const handleBlockExplorerApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlockExplorerApiKey(event.target.value as string);
    if (blockExplorerApiKeyError) {
      setBlockExplorerApiKeyError(false);
    }
  };

  // Search handlers
  const handleBlockchainSearch = async (value: string) => {
    setIsLoading(true);
    setWalletData(null);
    if (value?.length === 42 && value.startsWith('0x')) {
      const data = await fetchWalletData(value);
      setWalletData(data);

      const tokenSymbols = data.tokenBalances.map((balance) => balance.symbol);
      await getTokensData(tokenSymbols, { images: true, prices: true });
    } else {
    }
    setIsLoading(false);
  };

  const handleBlockchainSearchClick = () => {
    if (!isSearchDisabled) return;

    if (coinmarketcapApiKey?.length < 32) {
      setCoinmarketcapApiKeyError(true);
    }
    if (blockExplorerApiKey?.length < 32) {
      setBlockExplorerApiKeyError(true);
    }
  };

  const tableData = useMemo(() => {
    const columns = ['Token', 'Prise', 'Balance', 'Value'];

    if (!walletData || isLoading) return { columns };

    const objects = walletData.tokenBalances.map((balance) => {
      const normalizedTokenSymbol = balance.symbol.toUpperCase();
      const tokenImage = tokens?.[normalizedTokenSymbol]?.image;
      const tokenPrice = tokens?.[normalizedTokenSymbol]?.price;

      return {
        token: { image: tokenImage, value: balance.symbol },
        price: {
          value: tokenPrice ? `≈ $${tokenPrice}` : '',
          accessor: tokenPrice || 0,
        },
        balance: formatNumber(balance.balance),
        value: {
          value: tokenPrice ? `≈ $${tokenPrice * balance.balance}` : '',
          accessor: tokenPrice * balance.balance || 0,
        },
      };
    });

    const sortedObjects = objects.sort((object) => (object.value.accessor ? -1 : 1));

    return { columns, objects: sortedObjects };
  }, [walletData, isLoading]);

  return (
    <Grid className={classes.wrapper} container>
      <Grid md={6} sm={12} item>
        <Card className={classes.card}>
          <Box width='464px'>
            <Box width='100%' marginBottom='60px'>
              <Typography marginBottom='20px' variant='h1'>
                Whale Hunter
              </Typography>
              <Typography marginBottom='10px' variant='h2'>
                Helping users analyze wallets on blockchains
              </Typography>
              <Typography variant='body1'>
                Whale Hunter is a blockchain wallet analysis app that identifies high-value wallets for profitable
                transactions, enabling users to make informed predictions. It offers automated tracking of selected
                wallets and the option to replicate their transactions.
              </Typography>
            </Box>

            <Box width='100%' marginBottom='60px'>
              <RoundedIconButton color='google' startIcon={<img src='/icons/Google.logo.svg' />}>
                Sign in with Google
              </RoundedIconButton>
              <HorizontalSeparator margin='20px 0px'>or</HorizontalSeparator>
              <Box display='flex'>
                <ButtonRoot variant='outlined' sx={{ mr: '30px' }}>
                  Login
                </ButtonRoot>
                <ButtonRoot>Sing Up</ButtonRoot>
              </Box>
            </Box>

            <Box width='100%' display='flex' flexDirection='column' justifyContent='flex-start'>
              <ResourcesLink
                href='https://github.com/SVIT-Solutions/whale-hunter'
                target='_blank'
                icon={<GitHubLogo />}
                text='View Code'
                marginBottom='12px'
              />
              <ResourcesLink href='#' target='_blank' icon={<XLogo />} text='Follow us' />
            </Box>
          </Box>
        </Card>
      </Grid>
      <Grid md={6} sm={12} sx={{ p: '45px 30px 0px' }} item display='flex'>
        <Grid container>
          <Grid md={10} sm={12} item display='flex' flexDirection='column' alignItems='center'>
            <SearchByBlockchain
              onClick={handleBlockchainSearchClick}
              disabled={isSearchDisabled}
              tokenSymbol='eth'
              placeholder={searchPlaceholderText}
              fullWidth
              coinmarketcapApiKey={coinmarketcapApiKey}
              onSearch={handleBlockchainSearch}
            />

            {!walletData && !isLoading && (
              <Box height='402.4px' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                <img
                  className={classes.apiKeysSettingsImage}
                  src='/images/HomePage.APIKeysSettings.png'
                  alt='API Keys Settings'
                />
                <Typography color='markup' sx={{ color: theme.palette.markup.main }}>
                  The application is still under development, for this reason we ask you to enter your API keys for the
                  corresponding requests
                </Typography>
              </Box>
            )}

            <Box display='flex' alignItems='center' width='100%' sx={{ mb: '20px', mt: '40px' }}>
              <img src='/icons/Coinmarketcap.logo.svg' height='37px' />
              <InputRoot
                name='apikey'
                error={coinmarketcapApiKeyError}
                value={coinmarketcapApiKey}
                onChange={handleCoinmarketcapApiKeyChange}
                fullWidth
                placeholder='Enter your coinmarketcap API Key'
                sx={{ ml: '10px' }}
              />
            </Box>
            <Box display='flex' alignItems='center' width='100%'>
              <img
                src='/icons/Etherscan.logo.svg'
                height='37px'
                style={{ border: '1px solid #E7E7E7', borderRadius: '50%', background: 'white' }}
              />
              <InputRoot
                name='apikey'
                error={blockExplorerApiKeyError}
                value={blockExplorerApiKey}
                onChange={handleBlockExplorerApiKeyChange}
                fullWidth
                placeholder='Enter your Etherscan API Key'
                sx={{ ml: '10px' }}
              />
            </Box>

            {(walletData || isLoading) && (
              <Box
                sx={{
                  mt: '40px',
                  width: '100%',
                  maxHeight: (window.innerHeight * zoomLevel - 150) / zoomLevel / 1.25,
                }}
              >
                <TableRoot data={tableData} />
              </Box>
            )}
          </Grid>
          <Grid item></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
