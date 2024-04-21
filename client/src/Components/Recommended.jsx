
import React from 'react'
import styles from '../Styles/PopularProducts.module.css'

const Recommended = () => {
  return (
    <div className={styles.container}>
        <div className={styles.viewAll}>
        <h1>Recommended Products</h1>
            <h2><a href="">View All -&gt;</a></h2>
        </div>
        <div className={styles.productContainer}>
            <div className={styles.product}>
                <img src="https://picsum.photos/200/300?random=1" alt="product" />
                <h3>Product 1</h3>
                <p>$34.5 - 56.7</p>
                <p>Verified</p>
                
            </div>
            <div className={styles.product}>
                <img src="https://picsum.photos/200/300?random=2" alt="product" />
                <h3>Product 2</h3>
                <p>$34.5 - 56.7</p>
                <p>Verified</p>
            </div>
            <div className={styles.product}>
                <img src="https://picsum.photos/200/300?random=3" alt="product" />
                <h3>Product 3</h3>
                <p>$34.5 - 56.7</p>
                <p>Verified</p>
            </div>
            <div className={styles.product}>
                <img src="https://picsum.photos/200/300?random=4" alt="product" />
                <h3>Product 4</h3>
                <p>$34.5 - 56.7</p>
                <p>Verified</p>
            </div>
            <div className={styles.product}>
                <img src="https://picsum.photos/200/300?random=5" alt="product" />
                <h3>Product 5</h3>
                <p>$34.5 - 56.7</p>
                <p>Verified</p>
            </div>
            <div className={styles.product}>
                <img src="https://picsum.photos/200/300?random=6" alt="product" />
                <h3>Product 6</h3>
                <p>$34.5 - 56.7</p>
                <p>Verified</p>
            </div>
        </div>
    </div>
  )
}

export default Recommended