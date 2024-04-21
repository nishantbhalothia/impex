'use client';

import React from 'react';
import styles from '../Styles/Signin.module.css';
import Link from 'next/link';
import { loginUser, selectUser, setUser } from '@/redux/reducers/userReducer';
import { useDispatch } from 'react-redux';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

const Signin = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSubmit = async(e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    console.log('formdata',data);
    const res = await dispatch(loginUser(data));
    console.log('res',res);
    if (res.status === 200) {
      localStorage.setItem('authTokenUser',res.data.token);
      localStorage.setItem('user',JSON.stringify(res.data.user));  // set user in local storage remove in production
      //set cookie
      // Cookies.set('token',res.data.token);
      console.log('user',res.data.user);
      dispatch(setUser(res.data.user));
      router.push("/");
    }else{
      console.log("Error while logging in",res);
    }
  }
  return (
    <div className={styles.signinContainer}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          {/* <label htmlFor="username">Username:</label> */}
          <input type="text" id="username" name="username" placeholder='Your Username' />
        </div>
        <div className={styles.formGroup}>
          {/* <label htmlFor="password">Password:</label> */}
          <input type="password" id="password" name="password" placeholder='Password'/>
        </div>
        <button type="submit">Sign In</button>
      </form>
      <p>Don't have an account? <Link href="/users/signup">Sign up</Link></p>
    </div>
  );
};

export default Signin;
