import { TextField, TextFieldProps } from '@mui/material';
import React, { FC } from 'react';

export interface InputRootProps extends TextFieldProps {}

const InputRoot: FC<InputRootProps> = ({ ...textFieldProps }) => {
  return <TextField variant='outlined' {...textFieldProps} />;
};

export default InputRoot;
