import {AppProps} from 'next/app';
import Head from 'next/head';
import React from 'react';

import {ThemeProvider} from '@mui/material/styles';

import {qcrTheme} from 'sites-shared';

import 'sites-shared/lib/styles/styles.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'github-markdown-css/github-markdown.css';
import 'prismjs/themes/prism-tomorrow.css';

import 'src/styles/globals.scss';

const theme = qcrTheme();

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
