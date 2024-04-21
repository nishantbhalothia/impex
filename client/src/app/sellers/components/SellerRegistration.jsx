"use client";

import React, { useState } from "react";
import styles from "../Styles/SellerRegistration.module.css";
import countryCodes from "@/data/countryCodes";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { registerSeller, selectLoading } from "@/redux/reducers/sellerReducer";
import { useRouter } from "next/navigation";

const SellerRegistration = () => {
  const [companyType, setCompanyType] = useState("");
  const [otherCompanyType, setOtherCompanyType] = useState("");

  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const router = useRouter();

  const handleCompanyTypeChange = (event) => {
    const value = event.target.value;
    setCompanyType(value);
    // If "Other" is selected, clear otherCompanyType
    if (value !== "Others") {
      setOtherCompanyType("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    console.log("data", data);
    const res = await dispatch(registerSeller(data));
    console.log("res", res);
    if (res.status === 200) {
      router.push("/users/signin");
    } else {
      console.log("Error", res);
    }
  };
  return (
    <div className={styles.container}>
      <div>
          <h1>Seller Registration</h1>
          <p>All fields are required</p>
        </div>
      <form onSubmit={handleSubmit}>
        
        <div className={styles.formGroup}>
          <label htmlFor="username">Name:</label>
          <input
            required
            type="text"
            id="username"
            name="username"
            placeholder="Your Name"
          />

          <label htmlFor="email">Email:</label>
          <input required type="email" id="email" name="email" placeholder="Email" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="role">Type:</label>
          <select required name="role" id="role">
            <option key="Supplier" value="supplier">
              Supplier
            </option>
            <option key="Manufacturer" value="manufacturer">
              Manufacturer
            </option>
            <option key="Logistics" value="logistics">
              Logistics
            </option>
          </select>

          <label htmlFor="countryCode">Country:</label>
          <select required name="countryCode" id="countryCode">
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

          <label htmlFor="phoneNumber">Phone:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Phone Number"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="companyName">Company Name:</label>
          <input
            required
            type="text"
            id="companyName"
            name="companyName"
            placeholder="Company Name"
          />

          <label htmlFor="companyAddress">Company Address:</label>
          <input
            required
            type="text"
            id="companyAddress"
            name="companyAddress"
            placeholder="Company Address"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="companyWebsite">Company Website:</label>
          <input
            required
            type="text"
            id="companyWebsite"
            name="companyWebsite"
            placeholder="CompanyWebsite.com"
          />

          <label htmlFor="companyType">Company Type:</label>
          <select
            required
            name="companyType"
            id="companyType"
            value={companyType}
            onChange={handleCompanyTypeChange}
          >
            <option value="">Select Company Type</option>
            <option value="Private">Private Limited(PVT LTD)</option>
            <option value="Public">Public Limited (PLC)</option>
            <option value="Partnership">Partnership Company</option>
            <option value="Proprietorship">Sole Proprietorship</option>
            <option value="LLP">Limited Liability Partnership(LLP)</option>
            <option value="OPC">One Person Company(OPC)</option>
            <option value="Others">Other</option>
          </select>
          {/* Render input field for other company type if "Others" is selected */}
          {companyType === "Others" && (
            <input
              required
              type="text"
              id="otherCompanyType"
              name="otherCompanyType"
              placeholder="Specify Other Company Type"
              value={otherCompanyType}
              onChange={(event) => setOtherCompanyType(event.target.value)}
            />
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            required
            type="password"
            id="password"
            name="password"
            placeholder="Password"
          />
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            required
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account? <Link href="/sellers/login">Sign in</Link>
      </p>
      <p>
        Not a seller or service provider?{" "}
        <Link href="/users/signup"> Create Account</Link>
      </p>
    </div>
  );
};

export default SellerRegistration;
