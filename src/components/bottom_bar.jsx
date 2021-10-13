import React from 'react';

import {Typography} from '@mui/material';

import styles from '../styles/bottom_bar.module.scss';

export default function BottomBar() {
  return (
    <div className={styles.bar}>
      <div className={`site-bottom-bar ${styles.content}`}>
        <div className={styles.left}></div>
        <div className={styles.center}></div>
        <div className={styles.right}>
          <Typography variant="button">CRICOS No. 00213J</Typography>
        </div>
      </div>
    </div>
  );
}
