import React, { FC } from 'react';
import { Box, Link, LinkProps, Theme, Typography, colors } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';

export interface ResourcesLinkProps extends LinkProps {
  icon: React.ReactNode;
  text?: string;
}

const ResourcesLink: FC<ResourcesLinkProps> = ({ icon, text, ...linkProps }) => {
  const theme = useTheme();

  const useStyles = makeStyles((theme: Theme) => ({
    root: { cursor: 'pointer' },
    icon: {
      marginRight: '10px',
      '& svg ': {
        width: '24px',
        height: '24px',
        fill: theme.palette.primary.main,
      },
      '& path': {
        fill: theme.palette.primary.main,
      },
    },
  }));
  const classes = useStyles();

  return (
    <Link className={classes.root} display='flex' {...linkProps} underline='none'>
      <Box color='inherit' className={classes.icon}>
        {icon}
      </Box>
      <Typography variant='body1'>{text}</Typography>
    </Link>
  );
};

export default ResourcesLink;
