import {AppProps} from 'next/app';
import Head from 'next/head';
import React from 'react';

import {ThemeProvider, createTheme} from '@mui/material/styles';

import 'react-multi-carousel/lib/styles.css';

import '@fortawesome/fontawesome-free/css/all.css';

import 'github-markdown-css/github-markdown.css';

import 'prismjs/themes/prism-tomorrow.css';

import '../styles/globals.scss';

const theme = createTheme({
  palette: {primary: {main: '#00407a'}},
  typography: {
    h3: {
      fontWeight: 'bold',
      marginBottom: '40px',
      marginTop: '16px',
      textAlign: 'center',
    },
    subtitle1: {
      fontStyle: 'normal',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '16px',
    },
  },
});

export default function Site({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>QUT Centre for Robotics Open Source</title>
      </Head>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
