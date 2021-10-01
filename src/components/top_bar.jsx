import Link from 'next/link';
import {useRouter} from 'next/router';

import {AppBar, Tab, Tabs, makeStyles} from '@material-ui/core';

import QcrLogo from '!@svgr/webpack!/assets/qcr_logo_light.svg';
import styles from '../styles/top_bar.module.scss';

const appBarStyle = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    justifyContent: 'space-around',
    [theme.breakpoints.up(800)]: {
      flexDirection: 'row',
    },
  },
}));

const tabStyle = makeStyles({
  root: {
    color: 'white',
    opacity: 1.0,
    textTransform: 'capitalize',
  },
});

const tabsStyle = makeStyles({
  indicator: {
    backgroundColor: 'white',
  },
});

export default function TopBar() {
  const csAppBar = appBarStyle();
  const csTab = tabStyle();
  const csTabs = tabsStyle();
  const r = useRouter();
  const selected = r.asPath.startsWith('/collection') ?
    0 :
    r.asPath.startsWith('/code') ?
    1 :
    r.asPath.startsWith('/dataset') ?
    2 :
    false;
  return (
    <AppBar className={styles.bar} classes={csAppBar}>
      <Link href="/">
        <QcrLogo className={styles.logo} />
      </Link>
      <Tabs className={styles['tabs']} classes={csTabs} value={selected}>
        <Link href="/collection">
          <Tab classes={csTab} label="Collections" />
        </Link>
        <Link href="/code">
          <Tab classes={csTab} label="Code" />
        </Link>
        <Link href="/dataset">
          <Tab classes={csTab} label="Datasets" />
        </Link>
      </Tabs>
    </AppBar>
  );
}
