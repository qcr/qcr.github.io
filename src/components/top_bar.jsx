import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';

import {AppBar, Button, Toolbar} from '@material-ui/core';

import logo from '/assets/qcr_logo_light.png';
import styles from '../styles/top_bar.module.scss';

export default function TopBar() {
  const r = useRouter();
  const selected = r.asPath.startsWith('/code') ?
    'code' :
    r.asPath.startsWith('/dataset') ?
    'dataset' :
    r.asPath.startsWith('/collection') ?
    'collection' :
    undefined;
  return (
    <AppBar className={styles.bar}>
      <Toolbar className={styles['logo-section']}>
        <Link href="/">
          <Image
            className={styles.logo}
            alt="QCR Logo (light)"
            src={logo}
            layout="fill"
          />
        </Link>
        <Link href="/collection">
          <Button
            className={selected === 'collection' && styles['selected-tab']}
          >
            Collections
          </Button>
        </Link>
        <Link href="/code">
          <Button className={selected === 'code' && styles['selected-tab']}>
            Code
          </Button>
        </Link>
        <Link href="/dataset">
          <Button className={selected === 'dataset' && styles['selected-tab']}>
            Datasets
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
