'use client';

import React, { useState } from 'react';
import styles from '@/Styles/Seller/PromotionPage.module.css';

const PromotionPage = () => {
  const [selectedSection, setSelectedSection] = useState('offer');
  const [isActive, setIsActive] = useState('offer'); 

  const offerClickHandler = () => {
    setSelectedSection('offer');
    setIsActive('offer');
  };

  const promotionClickHandler = () => {
    setSelectedSection('promotion');
    setIsActive('promotion');
  };

  return (
    <div className={styles.container}>
      <div className={styles.offerHead}>
        <div
          className={`${styles.tab} ${isActive === 'offer' ? styles.active : ''}`}
          onClick={offerClickHandler}
        >
          Offers
        </div>
        <div
          className={`${styles.tab} ${isActive === 'promotion' ? styles.active : ''}`}
          onClick={promotionClickHandler}
        >
          Promotions
        </div>
      </div>
      <div>
        {selectedSection === 'offer' && (
          <div className={styles.floatingBox}>
            <h1>Offer Section</h1>
            <p>This is the offer section content.</p>
          </div>
        )}
        {selectedSection === 'promotion' && (
          <div className={styles.floatingBox}>
            <h1>Promotion Section</h1>
            <p>This is the promotion section content.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionPage;
