'use client'

import React, { useEffect } from 'react'
import styles from '@/Styles/Products/ProductsHome.module.css'
import { fetchProducts, selectProducts } from '@/redux/reducers/productReducer'
import { useDispatch, useSelector } from 'react-redux'
import { logClickedProduct } from '@/utils/userTracking'
import { selectUser } from '@/redux/reducers/userReducer'


const ProductsHome = () => {

    const dispatch = useDispatch()
    const products = useSelector(selectProducts)
    const user = useSelector(selectUser)
    console.log('All Products @ProductsHome:', products);

    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    // const products = useSelector(selectProducts).products

    const clickHandler = (productId) => () => {
        console.log('Product Clicked @productHome.jsx:',"user._id",user.id,"productID", productId);
        logClickedProduct(user.id, productId)
    }
  return (
    <div className={styles.container}>
        {products.map((product, index) => (
            <div key={product._id} className={styles.product} onClick={clickHandler(product._id)}>
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