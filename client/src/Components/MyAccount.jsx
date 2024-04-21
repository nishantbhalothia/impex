import React from 'react'
import styles from '../Styles/MyAccount.module.css'
import { logoutUser, selectUser } from '@/redux/reducers/userReducer'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'

const MyAccount = () => {
    // const user = selectUser()
    const dispatch = useDispatch()
    const router = useRouter()

    const logoutHandler = () => {

        const response = dispatch(logoutUser())

        if (response.status === 200) {
            // localStorage.removeItem('authTokenUser');
            // localStorage.removeItem('user');
        }   
        console.log('Logout response',response);
        router.push('/')
        window.location.reload()
    }   

  return (
    <div className={styles.container}>
        {/* <h1 className={styles.title}>Manage Account</h1> */}
        <div className={styles.account}>
            <div className={styles.accountDetails}>
                <h3>Wishlist</h3>
            </div>
            <div className={styles.accountDetails}>
                <h3>Orders</h3>
            </div>
            <div className={styles.accountDetails}>
                <h3>Profile</h3>
            </div>
            <div className={styles.accountDetails}>
                <h3>Addresses</h3>
            </div>
            <div className={styles.accountDetails}>
                <h3>My Account</h3>
            </div>
            <div className={styles.accountDetails}>
                <h2 onClick={logoutHandler}>Logout</h2>
            </div>
        </div>
    </div>
  )
}

export default MyAccount