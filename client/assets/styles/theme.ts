import { createTheme } from '@mui/material';
import { defaultColors } from './colors';

const createCustomTheme = (colors: any) => {
  return createTheme({
    typography: {
      fontFamily: 'CourierPrime-Regular, CourierNew-Regular, sans-serif',
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: colors.card,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          '@global': {
            body: {
              margin: 0,
              padding: 0,
            },
          },
        },
      },
    },
  });
};

export const defaultTheme = createCustomTheme(defaultColors);
