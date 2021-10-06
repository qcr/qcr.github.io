import * as React from 'react';
import Document, {Html, Head, Main, NextScript} from 'next/document';
import {ServerStyleSheets} from '@mui/styles';

import {GA_TRACKING_ID} from '../../lib/gtag';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// Hack to to support SSG in NextJs when developing:
//   - https://stackoverflow.com/a/62353543
//   - https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js
MyDocument.getInitialProps = async ctx => {
  const sheets = new ServerStyleSheets();

  const orig = ctx.renderPage;
  ctx.renderPage = () =>
    orig({
      enhanceApp: App => props => sheets.collect(<App {...props} />),
    });

  const initProps = await Document.getInitialProps(ctx);
  return {
    ...initProps,
    styles: [
      ...React.Children.toArray(initProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
