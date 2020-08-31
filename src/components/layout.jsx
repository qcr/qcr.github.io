import BottomBar from './bottom_bar';
import TopBar from './top_bar';

import styles from '../styles/layout.module.scss';

export default function Layout({children}) {
  return (
    <>
      <TopBar />
      <div className={styles.space} />
      {children}
      <BottomBar />
    </>
  );
}
