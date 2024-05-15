import React, { FC, useEffect } from 'react';
import { Box, InputAdornment, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LockOutlined, SearchOutlined } from '@mui/icons-material';

import SearchRoot, { SearchRootProps } from '@/components/searches/SearchRoot';
import { useGetTokensData } from '@/hooks/useGetTokensData';
import TokenIconButton from '@/components/buttons/TokenIconButton';

interface SearchByBlockchainProps extends SearchRootProps {
  tokenSymbol?: string;
  coinmarketcapApiKey?: string;
  onClick?: () => void;
}

const SearchByBlockchain: FC<SearchByBlockchainProps> = ({
  tokenSymbol = 'ETH',
  coinmarketcapApiKey,
  disabled,
  onClick,
  ...textFieldProps
}) => {
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      width: '100%',
      '& .MuiAutocomplete-root .MuiInputBase-root': {
        paddingRight: '0.89px',
      },
    },
  }));

  const classes = useStyles();

  const { tokens, getTokensData } = useGetTokensData(coinmarketcapApiKey);

  useEffect(() => {
    getTokensData([tokenSymbol], { images: true });
  }, [tokenSymbol]);

  return (
    <Box onClick={onClick} className={classes.root}>
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
                tokenLogoPath={tokens?.[tokenSymbol.toUpperCase()]?.image}
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
