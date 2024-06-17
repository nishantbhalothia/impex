'use client'

import React, { useState } from 'react';
import styles from '../Styles/Address.module.css';

const Address = () => {
    const [formData, setFormData] = useState({
        type: 'home',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: '',
        isDefault: false
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        // Process form submission (e.g., send data to backend)
        console.log(formData);
        // Reset form after submission
        setFormData({
            type: 'home',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            phone: '',
            isDefault: false
        });
        setErrors({});
    };

    const validateForm = (data) => {
        let errors = {};
        if (!data.addressLine1) {
            errors.addressLine1 = 'Address Line 1 is required';
        }
        if (!data.city) {
            errors.city = 'City is required';
        }
        if (!data.state) {
            errors.state = 'State is required';
        }
        if (!data.postalCode) {
            errors.postalCode = 'Postal Code is required';
        }
        if (!data.country) {
            errors.country = 'Country is required';
        }
        if (!data.phone) {
            errors.phone = 'Phone is required';
        }   
        // Add custom validation as needed (e.g., phone number)
        return errors;
    };

    return (
        <div className={styles.container}>
            <h1>Address Form</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="type">Type</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="home">Home</option>
                        <option value="office">Office</option>
                        <option value="billing">Billing</option>
                        <option value="shipping">Shipping</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label htmlFor="addressLine1">Address Line 1</label>
                    <input
                        id="addressLine1"
                        name="addressLine1"
                        type="text"
                        value={formData.addressLine1}
                        onChange={handleChange}
                    />
                    {errors.addressLine1 && <div className={styles.error}>{errors.addressLine1}</div>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="addressLine2">Address Line 2</label>
                    <input
                        id="addressLine2"
                        name="addressLine2"
                        type="text"
                        value={formData.addressLine2}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="city">City</label>
                    <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                    />
                    {errors.city && <div className={styles.error}>{errors.city}</div>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="state">State</label>
                    <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleChange}
                    />
                    {errors.state && <div className={styles.error}>{errors.state}</div>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        value={formData.postalCode}
                        onChange={handleChange}
                    />
                    {errors.postalCode && <div className={styles.error}>{errors.postalCode}</div>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="country">Country</label>
                    <input
                        id="country"
                        name="country"
                        type="text"
                        value={formData.country}
                        onChange={handleChange}
                    />
                    {errors.country && <div className={styles.error}>{errors.country}</div>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="phone">Phone</label>
                    <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    {errors.phone && <div className={styles.error}>{errors.phone}</div>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="isDefault">Default Address</label>
                    <input
                        id="isDefault"
                        name="isDefault"
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
        </div>
    );
};

export default Address;
