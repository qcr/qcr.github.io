import '@material/button/dist/mdc.button.css';
import '@material/card/dist/mdc.card.css';
import '@material/elevation/dist/mdc.elevation.css';
import '@material/floating-label/dist/mdc.floating-label.css';
import '@material/icon-button/dist/mdc.icon-button.css';
import '@material/line-ripple/dist/mdc.line-ripple.css';
import '@material/notched-outline/dist/mdc.notched-outline.css';
import '@material/ripple/dist/mdc.ripple.css';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/top-app-bar/dist/mdc.top-app-bar.css';
import '@material/typography/dist/mdc.typography.css';
import '@rmwc/icon/icon.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '@fortawesome/fontawesome-free/css/all.css';

import {ThemeProvider} from '@rmwc/theme';

import '../styles/globals.scss';

export default function Site({Component, pageProps}) {
  return (
    <>
      <ThemeProvider
        options={{
          primary: '#00407a',
        }}
        className="site"
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
