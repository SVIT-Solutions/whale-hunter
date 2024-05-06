import React from 'react';
import { Box, Card, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import RoundedIconButton from '@/components/buttons/RoundedIconButton';
import GoogleLogo from '@/assets/images/icons/Google.logo';
import HorizontalSeparator from '@/components/separators/HorizontalSeparator';
import ButtonRoot from '@/components/buttons/ButtonRoot';
import ResourcesLink from '@/components/links/ResourcesLink';
import GitHubLogo from '@/assets/images/icons/GitHub.logo';
import XLogo from '@/assets/images/icons/X.logo';

interface Props {
  children?: React.ReactNode;
}

const useStyles = makeStyles({
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
});

const HomeLayout = ({ children }: Props) => {
  const classes = useStyles();

  return (
    <Grid className={classes.wrapper} container>
      <Grid md={6} item>
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
              <RoundedIconButton color='google' startIcon={<GoogleLogo />}>
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
              <ResourcesLink href='#' target='_blank' icon={<XLogo />} text='View Code' />
            </Box>
          </Box>
        </Card>
      </Grid>
      <Grid md={6} item></Grid>
    </Grid>
  );
};

export default HomeLayout;
