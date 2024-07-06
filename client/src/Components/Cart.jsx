'use client'

import React, { useEffect, useState } from 'react';
import styles from '@/Styles/Cart.module.css';
import { deleteFromWishlist, fetchCart, selectUser } from '@/redux/reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchMultipleProducts, fetchProduct } from '@/redux/reducers/productReducer';fetchCart

const Cart = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [wishlist, setWishlist] = useState([]);
    const router = useRouter();

    console.log("User @Wishlist.jsx:", wishlist);

    useEffect(() => {
        const fetchAsyncWishlist = async () => {
            const res = await dispatch(fetchCart(user._id));
            console.log("Wishlist: @", res);
            if (res?.status === 200) {
                const productDetailsPromises = res.data.map(productId => dispatch(fetchProduct(productId)));
                const products = await Promise.all(productDetailsPromises);
                // const products = await dispatch(fetchMultipleProducts(res.data));
                // console.log("Products @Wishlist.jsx:", products);
                setWishlist(products.map(p => p.data));
            }
        };

        fetchAsyncWishlist();
    }, [dispatch, user._id]);

    const clickHandler = (productId) => () => {
        console.log("Product Clicked @productHome.jsx:", "user._id", user.id, "productID", productId);
        logClickedProduct(user.id, productId);
        router.push(`/products/${productId}`);
    };
    
    const toggleWishlist = (productId) => async () => {
        const res = await dispatch(deleteFromWishlist(productId));
        if (res?.status === 200) {
            console.log("Product removed from wishlist");
            setWishlist(wishlist.filter(product => product._id !== productId));
        }
    };

    return (
        <div className={styles.container}>
            <div>
                <h1>{`${user.username.split(' ')[0]}'s cart`}</h1>
                <p>Clear Cart</p>
            </div>
            {wishlist.map((product) => (
                <div key={product._id} className={styles.product}>
                    <div className={styles.productImg} onClick={clickHandler(product._id)}>
                        <img src={product.product?.images[0].url} alt={product.name} />
                    </div>
                    <div className={styles.wishlist} onClick={toggleWishlist(product._id)}>
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/9484/9484251.png"
                            alt="wishlisted"
                        />
                    </div>
                    <div className={styles.productInfo} onClick={clickHandler(product._id)}>
                        <h3>{product.name}</h3>
                        <div className={styles.price}>
                            <p>${product.product.priceRange.min}-${product.product.priceRange.max}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Cart;
