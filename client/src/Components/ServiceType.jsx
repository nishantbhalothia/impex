'use client';

import React, { useEffect, useState } from 'react';
import styles from '../styles/ServiceType.module.css';
import Link from 'next/link';

const ServiceType = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') {
      setActiveIndex(0);
    } else if (path === '/suppliers') {
      setActiveIndex(1);
    } else if (path === '/manufacturers') {
      setActiveIndex(2);
    } else if (path === '/logistics') {
      setActiveIndex(3);
    } else if (path === '/services') {
      setActiveIndex(4);
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={activeIndex === 0 ? styles.active : ''}><Link href='/'>Products</Link></h1>
      <h1 className={activeIndex === 1 ? styles.active : ''}><Link href='/suppliers'>Supplier</Link></h1>
      <h1 className={activeIndex === 2 ? styles.active : ''}><Link href='/manufacturers'>Manufacturers</Link></h1>
      <h1 className={activeIndex === 3 ? styles.active : ''}><Link href='/logistics'>Logistics</Link></h1>
      <h1 className={activeIndex === 4 ? styles.active : ''}><Link href='/services'>Services</Link></h1>
    </div>
  );
};

export default ServiceType;
