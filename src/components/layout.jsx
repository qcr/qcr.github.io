import {Typography} from '@rmwc/typography';

import BottomBar from './bottom_bar';
import TopBar from './top_bar';

import styles from '../styles/layout.module.scss';

export default function Layout({children, home}) {
  return (
    <>
      <TopBar />
      <div className={styles.space} />
      <Typography use="body1" className={`notify ${styles.progress}`}>
        Note: this site is a work in progress. Please visit&nbsp;
        <a href="https://research.qut.edu.au/qcr" target="_blank">
          this page
        </a>
        &nbsp;for general details about our work
      </Typography>
      <div className={`${styles.main} ${home ? styles.home : styles.content}`}>
        {children}
      </div>
      {/*<BottomBar /> */}
    </>
  );
}
