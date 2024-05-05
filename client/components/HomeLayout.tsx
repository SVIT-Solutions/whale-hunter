import { Box, Card } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

const useStyles = makeStyles({
  card: {},
});

const HomeLayout = ({ children }: Props) => {
  const classes = useStyles();

  return (
    <Box>
      <Card className={classes.card}>AA</Card>
    </Box>
  );
};

export default HomeLayout;
