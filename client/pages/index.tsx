import React, { useState } from 'react';
import { Box, Card, Grid, Theme, Typography } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';

import RoundedIconButton from '@/components/buttons/RoundedIconButton';
import HorizontalSeparator from '@/components/separators/HorizontalSeparator';
import ButtonRoot from '@/components/buttons/ButtonRoot';
import ResourcesLink from '@/components/links/ResourcesLink';
import SearchByBlockchain from '@/components/inputs/searches/SearchByBlockchain';

import XLogo from '@/assets/icons/X.logo';
import GitHubLogo from '@/assets/icons/GitHub.logo';
import InputRoot from '@/components/inputs/InputRoot';
import useInput from '@/hooks';

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

  const {
    value: coinmarketcapApiKey,
    onChange: handleCoinmarketcapApiKeyChange,
    clearValue: clearCoinmarketcapApiKeyValue,
  } = useInput<string>('');

  const {
    value: blockExplorerApiKey,
    onChange: handleBlockExplorerApiKeyApiKeyChange,
    clearValue: clearBlockExplorerApiKeyApiKeyValue,
  } = useInput<string>('');

  const handleBlockchainSearch = () => {};

  const isSearchDisabled = coinmarketcapApiKey.length < 32 || blockExplorerApiKey.length < 32;

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
      <Grid md={6} sm={12} sx={{ p: '45px 30px' }} item>
        <Box width='570px' display='flex' flexDirection='column' alignItems='center'>
          <SearchByBlockchain
            disabled={isSearchDisabled}
            tokenSymbol='eth'
            placeholder={
              isSearchDisabled ? 'Enter your api keys to start scanning' : 'Search by wallet or contract address'
            }
            fullWidth
            coinmarketcapApiKey={coinmarketcapApiKey}
            onSearch={handleBlockchainSearch}
          />
          <img
            className={classes.apiKeysSettingsImage}
            src='/images/HomePage.APIKeysSettings.png'
            alt='API Keys Settings'
          />
          <Typography color='markup' sx={{ color: theme.palette.markup.main, mb: '40px' }}>
            The application is still under development, for this reason we ask you to enter your API keys for the
            corresponding requests
          </Typography>
          <Box display='flex' alignItems='center' width='100%' sx={{ mb: '20px' }}>
            <img src='/icons/Coinmarketcap.logo.svg' height='37px' />
            <InputRoot
              name='apikey'
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
              value={blockExplorerApiKey}
              onChange={handleBlockExplorerApiKeyApiKeyChange}
              fullWidth
              placeholder='Enter your Etherscan API Key'
              sx={{ ml: '10px' }}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Home;
