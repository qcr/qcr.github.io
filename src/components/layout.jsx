import PropTypes from 'prop-types';
import React from 'react';

import BottomBar from './bottom_bar';
import TopBar from './top_bar';

import styles from '../styles/layout.module.scss';

function Layout({children, home, list}) {
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

Layout.propTypes = {
  children: PropTypes.elementType,
  home: PropTypes.bool,
  list: PropTypes.bool,
};

export default Layout;
