'use client';

import React from "react";
import Link from "next/link"; // Import Link from next/link
import styles from "../Styles/Signup.module.css";
import countryCodes from "@/data/countryCodes";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, selectLoading } from "@/redux/reducers/userReducer";
import { useRouter } from "next/navigation";


const Signup = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const router = useRouter();
  const handleSubmit = async(e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    console.log('data',data);
    const res = await dispatch(registerUser(data));
    console.log('res',res);
    if (res.status === 200) {
      router.push("/users/signin");
    }else{
      console.log("Error",res);
    }

  }
  return (
    <div className={styles.signupContainer}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Name:</label>
          <input type="text" id="username" name="username" placeholder="Your Name" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Phone:</label>
          <select id="countryCode" name="countryCode">
            {countryCodes.map((country, index) => {
              return (
                <option
                  key={index}
                  value={country.code}
                  selected={country.code === "+91"}
                >
                  {country.code}
                </option>
              );
            })}
          </select>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Phone Number"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Email" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
          />
        </div>
        {/* ================== This form is for user and default role is user ======================== */}
        <div className={styles.formGroup} style={{display:"none"}}>
          <label htmlFor="role">Role : </label>
          <input
            type="text"
            id="role"
            name="role"
            value="user"
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link href="/users/signin">Sign in</Link>
      </p>
      <p>
        Are you a seller or service provider? <Link href="/sellers/register"> Create Account</Link>
      </p>
    </div>
  );
};

export default Signup;
