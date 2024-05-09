import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import store from '@/redux/store';
import { defaultTheme } from '@/assets/styles/theme';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const client = new ApolloClient({
    uri: process.env.SERVER_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ApolloProvider>
    </ThemeProvider>
  );
}
