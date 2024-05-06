import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { FC } from 'react';

import ButtonRoot, { ButtonRootProps } from '@/components/buttons/ButtonRoot';

interface RoundedIconButtonProps extends ButtonRootProps {
  iconSize?: string;
}

const RoundedIconButton: FC<RoundedIconButtonProps> = ({ children, iconSize = '40.74px', ...buttonProps }) => {
  const useStyles = makeStyles({
    root: {
      '& button': {
        paddingLeft: 0,
      },
      '& .MuiButton-icon': {
        width: iconSize,
        height: iconSize,
        position: 'absolute',
        left: '6px',
        '& svg': {
          width: iconSize,
          height: iconSize,
        },
      },
    },
  });

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <ButtonRoot {...buttonProps}>{children}</ButtonRoot>
    </Box>
  );
};

export default RoundedIconButton;
