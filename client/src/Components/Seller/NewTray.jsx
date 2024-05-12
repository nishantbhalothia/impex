import React from "react";
import dynamic from "next/dynamic";
import styles from "../../Styles/Seller/NewTray.module.css";

const Link = dynamic(() => import("next/link"), { ssr: false });

const NewTray = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
      <Link href="/sellers/dashboard">Dashboard</Link>
      </div>
      <div className={styles.addNew}>
        <Link href="/products/addNew">
          {/* <img src="https://cdn-icons-png.flaticon.com/128/2311/2311991.png" alt="add product" title="Add New Product" /> */}
          New Product </Link>
      </div>
    </div>
  );
};

export default NewTray;
