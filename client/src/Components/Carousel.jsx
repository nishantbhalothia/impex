'use client';

import React, { useRef, useState } from 'react';
import styles from '../Styles/Carousel.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import './styles.css';

const Carousel = () => {
  return (
    <div className={styles.container}>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y]}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        spaceBetween={50}
        slidesPerView={3}
        navigation
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        className="mySwiper"
      >
        {
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <img src={`https://picsum.photos/500/300?random=${index}`} alt={`Slide ${index}`} />
              </SwiperSlide>
            )
          })
        }
        {/* <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide> */}
      </Swiper>
    </div>
  )
}

export default Carousel