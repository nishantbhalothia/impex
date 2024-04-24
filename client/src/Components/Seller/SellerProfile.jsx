'use client';

import React, { useEffect, useState } from 'react';
import styles from '../../Styles/Seller/SellerProfile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectSellerProducts, sellerProducts, setProducts, setUser } from '@/redux/reducers/sellerReducer';

const SellerProfile = () => {
  const dispatch = useDispatch();
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(sellerProducts());
        dispatch(setUser(response.data?.username));
        dispatch(setProducts(response.data?.products));
        console.log('response products', response.data?.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [dispatch]); // Include dispatch in the dependency array

  const products = useSelector(selectSellerProducts);

  console.log('Products:', products);

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.title}>Seller Profile</h1> */}
        {products.map(product => (
          <div key={product._id} className={styles.product}>
            
            <div className={styles['product-images']}>
              {product.images.map((image, index) => (
                <img key={index} src={image.url} alt={`Product ${index}`} className={styles['product-image']} />
              ))}
            </div>
            <h2>{product.name}</h2>
            <p>Brand Name: {product.brandName}</p>
            <p>Price: Min: {product.priceRange.min} Max: {product.priceRange.max}</p>
            <p>Category: {product.category}</p>
            <p>Description: {product.description}</p>
            <p>Manufacturer: {product.manufacturer}</p>
            <p>Origin: {product.origin}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Summary: {product.summary}</p>
            <p>Dimensions: Length: {product.packagingDimensions.length} Width: {product.packagingDimensions.width} Height: {product.packagingDimensions.heigh}</p>
            {product.isExpirable && <p>Expiry Date: {product.expiryDate}</p>}
            <p>Specifications: {product.specifications}</p>
            
          </div>
        ))}
    </div>
  );
};

export default SellerProfile;
