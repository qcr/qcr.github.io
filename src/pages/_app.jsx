import '@material/button/dist/mdc.button.css';
import '@material/icon-button/dist/mdc.icon-button.css';
import '@material/ripple/dist/mdc.ripple.css';
import '@material/top-app-bar/dist/mdc.top-app-bar.css';
import '@rmwc/icon/icon.css';

import {ThemeProvider} from '@rmwc/theme';

import '../styles/globals.scss';

export default function Site({Component, pageProps}) {
  return (
    <>
      <ThemeProvider
        options={{
          primary: '#00407a',
        }}
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
