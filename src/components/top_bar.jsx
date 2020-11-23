import {Button} from '@rmwc/button';
import {Theme} from '@rmwc/theme';
import {TopAppBar, TopAppBarSection, TopAppBarRow} from '@rmwc/top-app-bar';

import Link from 'next/link';
import {useRouter} from 'next/router';

import logo from '/assets/qcr_logo_light.png';
import styles from '../styles/top_bar.module.scss';

export default function TopBar() {
  const r = useRouter();
  const selected = r.asPath.startsWith('/code') ?
    'code' :
    r.asPath.startsWith('/dataset') ?
    'dataset' :
    r.asPath.startsWith('/project') ?
    'project' :
    undefined;
  return (
    <TopAppBar className={styles.bar}>
      <TopAppBarRow className={styles.row}>
        <TopAppBarSection alignStart className={styles['logo-section']}>
          <Link href="/">
            <img className={styles.logo} alt="QCR Logo (light)" src={logo} />
          </Link>
        </TopAppBarSection>
        <TopAppBarSection alignEnd className={styles.pages}>
          <Link href="/project">
            <Button
              className={selected === 'project' && styles['selected-tab']}
            >
              Projects
            </Button>
          </Link>
          <Link href="/code">
            <Button className={selected === 'code' && styles['selected-tab']}>
              Code
            </Button>
          </Link>
          <Link href="/dataset">
            <Button
              className={selected === 'dataset' && styles['selected-tab']}
            >
              Datasets
            </Button>
          </Link>
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
  );
}
