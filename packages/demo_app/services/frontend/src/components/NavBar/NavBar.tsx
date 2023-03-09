import React from 'react';
import styles from './NavBar.module.scss';

const NavBar = () => {
  return (
    <div className={styles.NavBar}>
      <div className={styles.logo}>
        <p style={{ fontSize: '2em' }}>CH Gallery</p>
        <div>
          <p>Est.</p>
          <p style={{ left: '-0.8em' }}>2023</p>
        </div>
      </div>
      <div className={styles.links}>
        <p>Login</p>
      </div>
      <div className={styles.links}>
        <p>Current Auction</p>
      </div>
      <div className={styles.links}>
        <p>Private Sales</p>
      </div>
      <div className={styles.links}>
        <p>Sell</p>
      </div>
    </div>
  );
};

export default NavBar;
