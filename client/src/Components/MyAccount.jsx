import React from 'react'
import styles from '../Styles/MyAccount.module.css'
import { logoutUser, selectUser } from '@/redux/reducers/userReducer'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'

const MyAccount = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    const logoutHandler = () => {
        const response = dispatch(logoutUser())

        if (response.status === 200) {
            // localStorage.removeItem('authTokenUser');
            // localStorage.removeItem('user');
        }
        console.log('Logout response', response);
        router.push('/')
        window.location.reload()
    }

    const clickHandler = (keyword) => {
        if (keyword === 'Wishlist') {
            router.push('/users/wishlist')
        } else if (keyword === 'Orders') {
            router.push('/users/orders')
        } else if (keyword === 'Profile') {
            router.push('/users/profile')
        } else if (keyword === 'Addresses') {
            router.push('/users/addresses')
        } else if (keyword === 'My Account') {
            router.push('/users/account')
        }
    }

    return (
        <div className={styles.container}>
            {/* <h1 className={styles.title}>Manage Account</h1> */}
            <div className={styles.account}>
                <div className={styles.accountDetails}>
                    <h3 onClick={() => clickHandler('Wishlist')}>Wishlist</h3>
                </div>
                <div className={styles.accountDetails}>
                    <h3 onClick={() => clickHandler('Orders')}>Orders</h3>
                </div>
                <div className={styles.accountDetails}>
                    <h3 onClick={() => clickHandler('Profile')}>Profile</h3>
                </div>
                <div className={styles.accountDetails}>
                    <h3 onClick={() => clickHandler('Addresses')}>Addresses</h3>
                </div>
                <div className={styles.accountDetails}>
                    <h3 onClick={() => clickHandler('My Account')}>My Account</h3>
                </div>
                <div className={styles.accountDetails}>
                    <h2 onClick={logoutHandler}>Logout</h2>
                </div>
            </div>
        </div>
    )
}

export default MyAccount
