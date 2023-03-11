import React from 'react';
import styles from './NavBar.module.scss';
import Link from 'next/link';

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
        <p>
          <a>
            <Link href='/imgbidding'>Current Auction</Link>
          </a>
        </p>
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
