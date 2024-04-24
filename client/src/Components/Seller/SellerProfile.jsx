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
          <p>
            Price Range :&nbsp;MOQ : {product.moq}&nbsp; &#8804; ${product.priceRange.max} to &nbsp;
            &#8805; ${product.priceRange.min}
          </p>
          <p>Brand Name: {product.brandName}</p>
          <p>Category: {product.category}</p>
          <p>Description: {product.description}</p>
          <p>Manufacturer: {product.manufacturer}</p>
          <p>Origin: {product.origin}</p>
          <p>Quantity: {product.quantity}</p>
          <p>Summary: {product.summary}</p>
          <p>
            Dimensions: Length: {product.packagingDimensions.length} Width:{" "}
            {product.packagingDimensions.width} Height:{" "}
            {product.packagingDimensions.heigh}
          </p>
          {product.isExpirable && typeof product.expiryDate === "string" && (
            <p>Expiry Date: {product.expiryDate.split("T")[0]}</p>
          )}
          <p>Specifications: {product.specifications}</p>
          <p>Specifications: {product.specifications}</p>
        </div>
      ))}
    </div>
  );
};

export default SellerProfile;
