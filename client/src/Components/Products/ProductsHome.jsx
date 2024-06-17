"use client";

import React, { useEffect, useState } from "react";
import styles from "@/Styles/Products/ProductsHome.module.css";
import { fetchProducts, selectProducts } from "@/redux/reducers/productReducer";
import { useDispatch, useSelector } from "react-redux";
import { logClickedProduct } from "@/utils/userTracking";
import { selectUser } from "@/redux/reducers/userReducer";
import { useRouter } from "next/navigation";

const ProductsHome = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const user = useSelector(selectUser);
  console.log("All Products @ProductsHome:", products);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const clickHandler = (productId) => () => {
    console.log(
      "Product Clicked @productHome.jsx:",
      "user._id",
      user.id,
      "productID",
      productId
    );
    logClickedProduct(user.id, productId);
    router.push(`/products/${productId}`);
  };

  const toggleWishlist = (productId) => () => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId)
        : [...prevWishlist, productId]
    );
  };

  return (
    <div className={styles.container}>
      {products.map((product) => (
        <div key={product._id} className={styles.product}>
          <div
            className={styles.productImg}
            onClick={clickHandler(product._id)}
          >
            <img src={product?.images[0].url} alt={product.name} />
          </div>
          <div
            className={styles.wishlist}
            onClick={toggleWishlist(product._id)}
          >
            {wishlist.includes(product._id) ? (
              <img
                src="https://cdn-icons-png.flaticon.com/128/9484/9484251.png"
                alt="wishlisted"
              />
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/128/1077/1077035.png"
                alt="add to wishlist"
              />
            )}
          </div>
          <div
            className={styles.productInfo}
            onClick={clickHandler(product._id)}
          >
            <h3>{product.name}</h3>
            <div className={styles.price}>
              <p>
                ${product.priceRange.min}-{product.priceRange.max}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsHome;
