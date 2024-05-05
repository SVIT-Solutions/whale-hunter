import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import store from '@/redux/store';
import { defaultTheme } from '@/assets/styles/theme';

export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
}
