
import React from 'react'
import styles from '../Styles/ProductInspired.module.css'

const ProductInspired = () => {
  return (
    <div className={styles.container}>
        <div className={styles.viewAll}>
        <h1>Inspired Products</h1>
            <h2><a href="">View All -&gt;</a></h2>
        </div>
        <div className={styles.productContainer}>
            {Array(20).fill().map((_, i) => (
              <div className={styles.product} key={i}>
                  <img src={`https://picsum.photos/200/300?random=${i+1}`} alt="product" />
                  <h3>Product {i+1}</h3>
                  <p>$34.5 - 56.7</p>
                  <p>MOQ : 1</p>
                  {i % 2 === 0 ? <p>Verified</p> : ''}
              </div>
            ))}
        </div>
    </div>
  )
}

export default ProductInspired