import {Button} from '@rmwc/button';
import {Theme} from '@rmwc/theme';
import {TopAppBar, TopAppBarSection, TopAppBarRow} from '@rmwc/top-app-bar';

import Link from 'next/link';

import logo from '/content/images/qcr_logo_light.png';
import styles from '../styles/top_bar.module.scss';

export default function TopBar() {
  return (
    <TopAppBar className={styles.bar}>
      <TopAppBarRow>
        <TopAppBarSection alignStart>
          <Link href="/">
            <img className={styles.logo} alt="QCR Logo (light)" src={logo} />
          </Link>
        </TopAppBarSection>
        <TopAppBarSection alignEnd className={styles.pages}>
          <Link href="/code">
            <Button theme={'secondary'}>Code</Button>
          </Link>
          <Link href="/datasets">
            <Button>Datasets</Button>
          </Link>
          <Link href="/docs">
            <Button>Docs</Button>
          </Link>
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
  );
}
