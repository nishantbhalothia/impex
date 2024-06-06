"use client";

import styles from "@/styles/Products/ProductPage.module.css";
import React, { useEffect, useState } from "react";
import { fetchProduct, selectProduct } from "@/redux/reducers/productReducer";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const ProductPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectProduct);

  useEffect(() => {
    const fetchProductData = async () => {
      const response = await dispatch(fetchProduct(id));

      if (response?.status !== 200) {
        setError("Product not found");
        router.push("/products/home"); // Redirect to a 'not-found' page
      }
    };

    fetchProductData();
  }, [dispatch, id, router]);

  return (
    <div className={styles.container}>
      {error ? (
        <h1 className={styles.error}>{error}</h1>
      ) : (
        <div className={styles.product}>
          <div className={styles.swiperContainer}>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y]}
              pagination={{
                dynamicBullets: true,
                clickable: true,
              }}
              slidesPerView={1}
              navigation
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              loop={true}
              className="mySwiper"
            >
              {product?.images?.map((item, index) => (
                <SwiperSlide key={index}>
                  <img
                    className={styles.image}
                    src={item.url}
                    alt={`Slide ${index}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.details}>
            <p className={styles.price}>
              Min ${product.priceRange?.min} - Max ${product.priceRange?.max}
            </p>
            <p className={styles.moq}>MOQ : {product.moq}</p>
          </div>
          <div className={styles.stockContainer}>
            <p className={styles.stock}>
              {product.quantity >= 1 ? "In Stock" : "Out of Stock"}{" "}
              {product.origin}{" "}
            </p>
          </div>
          <div className={styles.expiry}>
            {product.isExpirable && (
                <p className={styles.expiryDate}>
                Expiry Date : {product.expiryDate?.split("T")[0]}
              </p>
            )}
          </div>
          <div className={styles.descriptionContainer}>
            <p className={styles.description}>{product.description}</p>
          </div>
          <div className={styles.specificationsContainer}>
            <p className={styles.specifications}>{product.specifications}</p>
          </div>
          <div className={styles.summaryContainer}>
            <p className={styles.summary}>{product.summary}</p>
          </div>
          <div className={styles.packagingContainer}>
            <div>
              {product.packagingDimensions && (
                <p className={styles.packagingDimensions}>
                  Packaging Dimensions (L*W*H) : {product.packagingDimensions.length} *{" "}
                  {product.packagingDimensions.width} *{" "}
                  {product.packagingDimensions.height}{" "} cm
                </p>
              )}
            </div>
            <div>
              {product.weight && (
                <p className={styles.weight}>Weight : {product.weight} gm</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
