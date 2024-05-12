import { createTheme } from '@mui/material';
import { defaultColors, googleButtonColor } from './colors';
import { hexToRgba } from '@/utils';
import { IThemeColors } from '@/types';

const createCustomTheme = (colors: IThemeColors) => {
  return createTheme({
    typography: {
      fontFamily: 'Open Sans, sans-serif',
      h1: {
        color: colors.headersTextColor,
        fontSize: '64px',
        fontWeight: 700,
      },
      h2: {
        color: colors.headersTextColor,
        fontSize: '20px',
        fontWeight: 700,
      },
      body1: {
        color: colors.headersTextColor,
        fontSize: '16px',
        fontWeight: 400,
      },
      caption: {
        color: colors.markup,
        fontSize: '20px',
      },
    },
    palette: {
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
      success: {
        main: colors.success,
      },
      error: {
        main: colors.error,
      },
      google: {
        main: googleButtonColor,
      },
      markup: {
        main: colors.markup,
      },
      header: {
        main: colors.headersTextColor,
      },
      disabled: {
        main: colors.disabled,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: colors.card,
            borderColor: colors.cardBorderColor,
            boxShadow: `0 0 2px 1px ${colors.cardBorderColor}`,
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-root': {
              color: colors.headersTextColor,
              borderColor: colors.tableDelimiterColor,
              fontSize: '16px',
              padding: '10px 0',
            },
            '& .MuiTableCell-head': {
              fontSize: '12px',
              fontWeight: 400,
              paddingBottom: '5px',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontSize: '16px',
            borderRadius: '100px',
            height: '44px',
          },
          contained: {
            color: colors.headersTextColor,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            border: '1px solid',
            borderColor: colors.headersTextColor,
            borderRadius: '100px',
            '& .MuiOutlinedInput-notchedOutline': {
              display: 'none',
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: colors.headersTextColor,
            fontSize: '16px',
            height: '37px',
            '& input': { height: '37px', boxSizing: 'border-box' },
            '& input::placeholder': { color: colors.markup },
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: { root: { color: colors.headersTextColor } },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: 'Open Sans, sans-serif',
            backgroundColor: hexToRgba(colors.backgroundColor1, 1),
            background: `linear-gradient(122deg, ${hexToRgba(colors.backgroundColor1, 1)} 50%, ${hexToRgba(
              colors.backgroundColor2,
              1
            )} 100%);`,
            scrollbarColor: `#888 ${colors.card}`,
          },
        },
      },
    },
  });
};

export const defaultTheme = createCustomTheme(defaultColors);
