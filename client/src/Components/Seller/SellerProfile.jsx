"use client";

import React, { useEffect, useState } from "react";
import styles from "../../Styles/Seller/SellerProfile.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSellerProducts,
  sellerProducts,
  setProducts,
  setUser,
} from "@/redux/reducers/sellerReducer";

const SellerProfile = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectSellerProducts);
  const [allProducts, setAllProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(sellerProducts());
        dispatch(setUser(response.data?.username));
        dispatch(setProducts(response.data?.products));
        console.log("response products", response.data?.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [dispatch]); // Include dispatch in the dependency array

  // const products = useSelector(selectSellerProducts);

    // Use setTimeout to change the current image index every 2 seconds
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % products.length);
      }, 2000); // Change image every 2 seconds
  
      return () => clearInterval(interval); // Clean up the interval on component unmount
    }, [products.length]); // Trigger effect when products length changes
  

  console.log("Products:", products);

  return (
    <div className={styles.container}>
  {/* <h1 className={styles.title}>Seller Profile</h1> */}
  {products.map((product) => (
    <div key={product._id} className={styles.product}>
      <div className={styles["product-images"]}>
        {product.images.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={`Product ${index}`}
            className={styles["product-image"]}
          />
        ))}
      </div>
      <h2>{product.name}</h2>
        <div className={styles.productDetails}>
          <p>MOQ :</p>
          <p> {product.moq}</p>
        </div>
        <div className={styles.productDetails}>
          <p>
            Price Range : </p> 
            <p>&nbsp; &#8804; ${product.priceRange.max} to &nbsp;
            &#8805; ${product.priceRange.min}
          </p>
        </div>
        <div className={styles.productDetails}>
          <p>Brand Name: </p>
          <p>{product.brandName}</p>
        </div>
        <div className={styles.productDetails}>
          <p>Category: </p>
          <p>{product.category}</p>
        </div>
        <div className={styles.productDetails}>
          <p>Description: </p>
          <p>{product.description}</p>
        </div>
        <div className={styles.productDetails}>
          <p>Manufacturer: </p>
          <p>{product.manufacturer}</p>
        </div>
        <div className={styles.productDetails}>
          <p>Origin: </p>
          <p>{product.origin}</p>
        </div>
        <div className={styles.productDetails}>
          <p>Quantity: </p>
          <p>{product.quantity}</p>
        </div>
        <div className={styles.productDetails}>
          <p>Summary: </p>
          <p>{product.summary}</p>
        </div>
        <div className={styles.productDetails}>
          <p>
            Dimensions(L*W*H): </p>
            <p>{product.packagingDimensions.length} * {" "}
            {product.packagingDimensions.width} *{" "}
            {product.packagingDimensions.height}
            </p>
        </div>
        {product.isExpirable && typeof product.expiryDate === "string" && (
          <div className={styles.productDetails}>
            <p>Expiry Date: </p>
            <p>{product.expiryDate.split("T")[0]}</p>
          </div>
        )}
        <div className={styles.productDetails}>
          <p>Specifications:</p>
          <p>{product.specifications}</p>
        </div>
        <div className={styles.productDetails}>
          <p>Specifications: </p>
          <p>{product.specifications}</p>
        </div>
      <div className={styles.buttonCont}>
        <button className={styles["product-button"]}>Edit</button>
        <button className={styles["product-button"]}>Delete</button>
      </div>
    </div>
  ))}
</div>

  );
};

export default SellerProfile;
