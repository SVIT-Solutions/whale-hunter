import { Box, Card, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

const useStyles = makeStyles({
  wrapper: { height: '100vh' },
  card: { height: '100%', borderRadius: 0, boxShadow: 'none' },
});

const HomeLayout = ({ children }: Props) => {
  const classes = useStyles();

  return (
    <Grid className={classes.wrapper} container>
      <Grid md={6} item>
        <Card className={classes.card}>AA</Card>
      </Grid>
      <Grid md={6} item></Grid>
    </Grid>
  );
};

export default HomeLayout;
