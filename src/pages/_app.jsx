import Head from 'next/head';

import {ThemeProvider} from '@material-ui/styles';
import {createTheme} from '@material-ui/core';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '@fortawesome/fontawesome-free/css/all.css';

import 'github-markdown-css/github-markdown.css';

import 'prismjs/themes/prism-tomorrow.css';

import '../styles/globals.scss';

const theme = createTheme({palette: {primary: {main: '#00407a'}}});

export default function Site({Component, pageProps}) {
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
