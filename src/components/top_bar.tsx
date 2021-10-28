import Link from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';

import {AppBar, Tab, Tabs} from '@mui/material';

import QcrLogo from '!@svgr/webpack!/assets/qcr_logo_light.svg';
import styles from '../styles/top_bar.module.scss';

const tabStyle = {
  color: 'white',
  opacity: 1.0,
  textTransform: 'capitalize',
};

export default function TopBar() {
  const r = useRouter();
  const selected = r.asPath.startsWith('/collection') ?
    0 :
    r.asPath.startsWith('/code') ?
    1 :
    r.asPath.startsWith('/dataset') ?
    2 :
    false;
  return (
    <AppBar
      className={styles.bar}
      sx={{
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: {
          md: 'row',
        },
      }}
    >
      <Link href="/" passHref>
        <QcrLogo className={styles.logo} />
      </Link>
      <Tabs
        className={styles['tabs']}
        value={selected}
        TabIndicatorProps={{
          style: {
            backgroundColor: 'white',
          },
        }}
      >
        <Link href="/collection" passHref>
          <Tab label="Collections" sx={tabStyle} />
        </Link>
        <Link href="/code" passHref>
          <Tab label="Code" sx={tabStyle} />
        </Link>
        <Link href="/dataset" passHref>
          <Tab label="Datasets" sx={tabStyle} />
        </Link>
      </Tabs>
    </AppBar>
  );
}
