import { LockOutlined, SearchOutlined } from '@mui/icons-material';
import { Autocomplete, InputAdornment, TextField, TextFieldProps, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { FC } from 'react';

export interface SearchRootProps extends TextFieldProps {
  disabled?: boolean;
  onSearch: (query: string) => void;
}

const SearchRoot: FC<SearchRootProps> = ({ disabled, onSearch, ...textFieldProps }) => {
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      pointerEvents: 'auto',
      userSelect: 'auto',
      '& .MuiFormControl-root': {
        borderColor: theme.palette.header.main,
      },
      '& .MuiSvgIcon-root': {
        fill: theme.palette.header.main,
      },
      '& .MuiInputAdornment-root': {
        pointerEvents: 'auto',
      },
    },
    disabled: {
      pointerEvents: 'none',
      userSelect: 'none',
      '& .MuiFormControl-root': { cursor: 'not-allowed', borderColor: theme.palette.disabled.main },
      '& .MuiSvgIcon-root': {
        fill: theme.palette.disabled.main,
      },
      '& .MuiButtonBase-root': {
        pointerEvents: 'auto',
      },
    },
  }));

  const classes = useStyles();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch((event.target as HTMLInputElement).value);
    }
  };

  return (
    <Autocomplete
      options={[]}
      className={disabled ? classes.disabled : classes.root}
      disableClearable
      renderInput={(params) => (
        <TextField
          {...params}
          variant='outlined'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>{disabled ? <LockOutlined /> : <SearchOutlined />}</InputAdornment>
            ),
          }}
          {...textFieldProps}
        />
      )}
      onKeyPress={handleKeyPress}
    />
  );
};

export default SearchRoot;
