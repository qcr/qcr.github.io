import BottomBar from './bottom_bar';
import TopBar from './top_bar';

import styles from '../styles/layout.module.scss';

export default function Layout({children, home, list}) {
  return (
    <div className={styles.page}>
      <TopBar />
      <div className={styles.space} />
      <div
        className={`${styles.main} ${
          home ? styles.home : list ? styles.list : styles.content
        }`}
      >
        {children}
      </div>
      <BottomBar />
    </div>
  );
}
