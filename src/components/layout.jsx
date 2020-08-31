import BottomBar from './bottom_bar';
import TopBar from './top_bar';

import styles from '../styles/layout.module.scss';

export default function Layout({children, home}) {
  return (
    <>
      <TopBar />
      <div className={styles.space} />
      <div className={home ? styles.home : styles.content}>{children}</div>
      {/*<BottomBar /> */}
    </>
  );
}
