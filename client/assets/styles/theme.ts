import { createTheme } from '@mui/material';
import { defaultColors } from './colors';
import { hexToRgba } from '@/utils';

const createCustomTheme = (colors: any) => {
  return createTheme({
    typography: {
      fontFamily: 'sans-serif',
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
          body: {
            backgroundColor: hexToRgba(colors.backgroundColor1, 1),
            background: `linear-gradient(122deg, ${hexToRgba(colors.backgroundColor1, 1)} 50%, ${hexToRgba(
              colors.backgroundColor2,
              1
            )} 100%);`,
          },
        },
      },
    },
  });
};

export const defaultTheme = createCustomTheme(defaultColors);
