import { Button, ButtonProps, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { FC } from 'react';

export interface ButtonRootProps extends ButtonProps {
  children?: React.ReactNode;
  width?: string;
}

const ButtonRoot: FC<ButtonRootProps> = ({ children, width = '100%', ...buttonProps }) => {
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      width,
    },
  }));

  const classes = useStyles();

  return (
    <Button variant='contained' className={classes.root} {...buttonProps}>
      {children}
    </Button>
  );
};

export default ButtonRoot;
