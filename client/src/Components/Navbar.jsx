'use client';

import React, {useState} from 'react';
import styles from '../styles/Navbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getLocation, selectCountry, selectIsLoggedIn, selectUser } from '../redux/reducers/userReducer.js';
import Link from 'next/link';
import MyAccount from './MyAccount';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [showAccount, setShowAccount] = useState(false);
    const country = useSelector(selectCountry);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const user = useSelector(selectUser);

    const router = useRouter();

    const dispatch = useDispatch();
    if (!country) {
        dispatch(getLocation());
    }

    const cartHandler = () => {
        if (isLoggedIn) {
            router.push('/users/cart');
        } else {
            router.push('/users/signin');
        }
    }

  return (
    <nav className={styles.navbar}>
        <div><h3> <Link href={'/'}>Bhalothia.com</Link></h3></div>
        <div className={styles.navLeft}>
            <div>
                <Link href="/sellers/login">Switch to seller Account</Link>
            </div>
            <div>
            <p>Ship to : {country}</p>
            </div>
            <div className={styles.regin}>
                <img src="https://cdn-icons-png.flaticon.com/128/2331/2331123.png" alt="" />
                <p>English - USD</p>
            </div>
            <div className={styles.assured}>
                <img title='Bhalothia Assured' src="https://cdn-icons-png.flaticon.com/128/9375/9375493.png" alt="" />
            </div>
            <div className={styles.assured}>
                <img title='Cart' onClick={cartHandler} src="https://cdn-icons-png.flaticon.com/128/833/833314.png" alt="" />
            </div>
            <div className={styles.assured}>
                <img src="https://cdn-icons-png.flaticon.com/128/1077/1077063.png" alt="" />
                {isLoggedIn ? <p className={styles.myAccount} onClick={()=> setShowAccount(!showAccount)}>My Account</p> : <p><Link href="/users/signin">Sign In</Link></p>}
            </div>
            {
                showAccount && <MyAccount />
            }
        </div>
    </nav>
  );
};

export default Navbar;
