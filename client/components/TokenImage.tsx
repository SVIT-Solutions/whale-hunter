import { Box, Skeleton } from '@mui/material';
import React, { FC } from 'react';

interface TokenImageProps {
  image: string;
  loading?: boolean;
  height?: number;
  width?: number;
  style?: React.CSSProperties;
}

const TokenImage: FC<TokenImageProps> = ({ image, style, width = 20, height = 20, loading = false }) => {
  return (
    <Box style={style}>
      {loading || !image ? (
        <Skeleton height={`${height}px`} width={`${width}px`} variant='circular' />
      ) : (
        <img style={{ borderRadius: '50%' }} height={`${height}px`} width={`${width}px`} src={image}></img>
      )}
    </Box>
  );
};

export default TokenImage;
