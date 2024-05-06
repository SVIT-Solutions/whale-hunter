import { Button, ButtonProps, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { FC } from 'react';

export interface ButtonRootProps extends ButtonProps {
  children?: React.ReactNode;
  width?: string;
  height?: string;
}

const ButtonRoot: FC<ButtonRootProps> = ({ children, width = '100%', height = '44px', ...buttonProps }) => {
  const useStyles = makeStyles({
    root: {
      borderRadius: '100px',
      width,
      height,
    },
  });

  const classes = useStyles();

  return (
    <Button variant='contained' className={classes.root} {...buttonProps}>
      {children}
    </Button>
  );
};

export default ButtonRoot;
