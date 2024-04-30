import React from 'react';
import dynamic from 'next/dynamic';
import styles from '../../Styles/Seller/NewTray.module.css';

const Link = dynamic(() => import('next/link'), { ssr: false });

const NewTray = () => {
  return (
    <div className={styles.container}>
        <div>
            <Link href="/products/addNew">New Product</Link>
        </div>
      <div>
        <Link href="/sellers/dashboard">Dashboard</Link>
      </div>
    </div>
  );
};

export default NewTray;
