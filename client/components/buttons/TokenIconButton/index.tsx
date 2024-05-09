import React, { FC } from 'react';
import { Box, IconButton, IconButtonProps, Skeleton } from '@mui/material';

interface TokenIconButtonProps extends IconButtonProps {
  tokenLogoPath: string | null;
  height?: number;
  width?: number;
}

const TokenIconButton: FC<TokenIconButtonProps> = ({
  tokenLogoPath,
  width = 32.69,
  height = 32.69,
  ...iconButoonProps
}) => {
  return (
    <Box>
      {tokenLogoPath ? (
        <IconButton sx={{ height: `${height + 2.21}px`, width: `${width + 2.21}px` }} {...iconButoonProps}>
          <img height={`${height}px`} width={`${width}px`} src={tokenLogoPath as string} />
        </IconButton>
      ) : (
        <Skeleton height={`${height}px`} width={`${width}px`} variant='circular' />
      )}
    </Box>
  );
};

export default TokenIconButton;
