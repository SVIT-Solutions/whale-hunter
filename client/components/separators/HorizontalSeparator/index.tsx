import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface HorizontalSeparatorProps {
  children?: React.ReactNode;
  width?: string;
  height?: string;
  margin?: string;
}

const HorizontalSeparator: FC<HorizontalSeparatorProps> = ({ children, width = '100%', height = `44px`, margin }) => {
  const useStyles = makeStyles({
    root: { display: 'flex', margin },
    line: { width: '100%', height: '1px', dispaly: 'flex' },
  });

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography alignContent='center' width='100%' textAlign='start' variant='caption'>
        <hr className={classes.line} />
      </Typography>
      <Typography alignContent='center' textAlign='center' variant='caption' margin='0px 24px'>
        {children}
      </Typography>
      <Typography alignContent='center' width='100%' textAlign='end' variant='caption'>
        <hr className={classes.line} />
      </Typography>
    </Box>
  );
};

export default HorizontalSeparator;
