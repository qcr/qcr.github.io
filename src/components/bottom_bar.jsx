import {IconButton} from '@rmwc/icon-button';
import {Typography} from '@rmwc/typography';

import styles from '../styles/bottom_bar.module.scss';

export default function BottomBar() {
  const iconConfig = {
    strategy: 'className',
    basename: 'icon',
    prefix: 'icon',
  };
  return (
    <div className={styles.bar}>
      <div className={`site-bottom-bar ${styles.content}`}>
        <div className={styles.left}></div>
        <div className={styles.center}></div>
        <div className={styles.right}>
          <Typography use="body2">CRICOS No. 00213J</Typography>
        </div>
      </div>
    </div>
  );
}
