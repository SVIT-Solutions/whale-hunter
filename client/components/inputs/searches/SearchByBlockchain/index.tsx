import React, { FC } from 'react';
import { Box, InputAdornment, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LockOutlined, SearchOutlined } from '@mui/icons-material';

import SearchRoot, { SearchRootProps } from '@/components/inputs/searches/SearchRoot';
import { useGetTokenLogoPath } from '@/hooks';
import TokenIconButton from '@/components/buttons/TokenIconButton';

interface SearchByBlockchainProps extends SearchRootProps {
  tokenSymbol?: string;
  coinmarketcapApiKey?: string;
}

const SearchByBlockchain: FC<SearchByBlockchainProps> = ({
  tokenSymbol = 'ETH',
  coinmarketcapApiKey,
  disabled,
  ...textFieldProps
}) => {
  const tokenLogoPath = useGetTokenLogoPath({ tokenSymbol, coinmarketcapApiKey });

  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      width: '100%',
      '& .MuiAutocomplete-root .MuiInputBase-root': {
        paddingRight: '0.89px',
      },
    },
  }));

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <SearchRoot
        disabled={disabled}
        name='token'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>{disabled ? <LockOutlined /> : <SearchOutlined />}</InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              <TokenIconButton
                onClick={(e) => {
                  e.stopPropagation();
                }}
                tokenLogoPath={tokenLogoPath}
              />
            </InputAdornment>
          ),
        }}
        {...textFieldProps}
      />
    </Box>
  );
};

export default SearchByBlockchain;
