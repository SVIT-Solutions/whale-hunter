import { TextField, TextFieldProps, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { FC } from 'react';

export interface InputRootProps extends TextFieldProps {}

const InputRoot: FC<InputRootProps> = ({ error, ...textFieldProps }) => {
  const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    error: {
      borderColor: theme.palette.error.main,
    },
  }));

  const classes = useStyles();

  return <TextField className={error ? classes.error : classes.root} variant='outlined' {...textFieldProps} />;
};

export default InputRoot;
