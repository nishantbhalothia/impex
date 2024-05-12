'use client'

import React, { useEffect } from 'react'
import styles from '@/Styles/Products/ProductsHome.module.css'
import { fetchProducts, selectProducts } from '@/redux/reducers/productReducer'
import { useDispatch, useSelector } from 'react-redux'


const ProductsHome = () => {

    const dispatch = useDispatch()
    const products = useSelector(selectProducts)
    console.log('All Products @ProductsHome:', products);

    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    // const products = useSelector(selectProducts).products
  return (
    <div className={styles.container}>
        {products.map((product, index) => (
            <div key={product._id} className={styles.product}>
                <div className={styles.productImg}>
                    <img src={product?.images[0] } alt={product.name} />
                </div>
                <div className={styles.productInfo}>
                    <h3>{product.name}</h3>
                    {/* <div><p>{product.description}</p></div> */}
                    <div><p>${product.priceRange.min}-{product.priceRange.max}</p></div>
                </div>
            </div>
        ))}
    </div>
)}

export default ProductsHome