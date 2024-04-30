"use client";

import React, { useState, useEffect } from "react";
import style from "@/Styles/Products/AddProducts.module.css";
import {
  addProduct,
  fetchProduct,
  selectProductId,
} from "@/redux/reducers/productReducer";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// when seller logged in then all products are fetched from the database and displayed in the seller profile page and stored in the redux store
// so we can use the useSelector(selectproducts) selectProducts is exported from the productReducer.js file
// then we can use filter method to filter out the product with the id that we want to update, it well reduce load on the server

const EditProducts = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  //   const [selectedCategory, setSelectedCategory] = useState("");
  //   const [otherCategory, setOtherCategory] = useState("");
  //   const [isExpirable, setIsExpirable] = useState(false);
  //   const [expiryDate, setExpiryDate] = useState(false);
  const productId = useSelector(selectProductId);
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    manufacturer: "",
    description: "",
    origin: "",
    isExpirable: false,
    expiryDate: "",
    category: "",
    otherCategory: "",
    minPrice: "",
    maxPrice: "",
    quantity: "",
    specifications: "",
    length: "",
    width: "",
    height: "",
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await dispatch(fetchProduct(productId));
        const productData = response.data.product;
        // Update the form data state with fetched data
        setFormData((prevData)=>({
            ...prevData,
          name: productData.name || "",
          brandName: productData.brandName || "",
          manufacturer: productData.manufacturer || "",
          description: productData.description || "",
          origin: productData.origin || "",
          isExpirable: productData.isExpirable || false,
          expiryDate: productData?.expiryDate?.split("T")[0] || "",
          category: productData.category || "",
          otherCategory: productData.otherCategory || "",
          minPrice: productData.priceRange.min || "",
          maxPrice: productData.priceRange.max || "",
          quantity: productData.quantity || "",
          specifications: productData.specifications || "",
          length: productData.packagingDimensions.length || "",
          width: productData.packagingDimensions.width || "",
          height: productData.packagingDimensions.height || "",
        }));
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [dispatch, productId]);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      category: value,
    }));
  };

  const handleExpirableChange = (event) => {
    const value = event.target.value === "true";
    setFormData((prevData) => ({
      ...prevData,
      isExpirable: value,
      expiryDate: value ? prevData.expiryDate : false,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Create an array to store image names
    const imageNames = [];

    // Extract image names from the FormData
    for (const file of formData.getAll("images")) {
      imageNames.push(file.name);
    }

    // Convert the rest of the form data to JSON
    const data = {};
    formData.forEach((value, key) => {
      if (key !== "images") {
        if (data[key]) {
          if (Array.isArray(data[key])) {
            data[key].push(value);
          } else {
            data[key] = [data[key], value];
          }
        } else {
          data[key] = value;
        }
      }
    });

    // Add the image names array to the data object
    data.images = imageNames;

    // If the category is "Others", add the other category to the data
    if (formData.category === "Others") {
      data.otherCategory = formData.otherCategory;
    }

    console.log("Form data @EditProducts:", data);
    // const response = await dispatch(addProduct(data));
    // console.log('Add new product respone',response);
    // if (response.status === 200) {
    //   alert('Product added successfully');
    //   router.push('/sellers/profile');
    // } else {
    //   alert('Failed to add product');
    // }

    // Clear the form
    // form.reset();
  };

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={submitHandler}>
        <div className={style.formInput}>
          <label htmlFor="name">Product Name</label>
          <img
            title="Enter Product name like : Puma shoes with soft gel sole white and read thread breathable fabric daily use"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            placeholder="Product name and can add related Keywords and Phrases"
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="brandName">Brand Name</label>
          <img
            title="Enter Product Brand Name like : Puma, Adidas, Crosair, Dell"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={formData.brandName}
            placeholder="Ex Bhalothia.com Puma Samsung Sony Dell"
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="manufacurer">Manufacturer</label>
          <img
            title="Enter Product manufacturer Like: xyz pvt ltd (if multiple manufacturers then enter all)"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="text"
            id="manufacurer"
            name="manufacurer"
            value={formData.manufacturer}
            placeholder="Ex xyx pvt ltd"
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="description">Description</label>
          <img
            title="Provide full Description about porduct like:Experience ultimate comfort and style with our innovative Puma shoes. 
            Crafted with a breathable fabric that keeps your feet cool and dry, these shoes feature a soft sole for unparalleled cushioning and support. 
            Not only are they incredibly comfortable, but they are also washable, making them easy to clean and maintain. 
            Step into a new level of comfort and performance with Puma Breathable Shoes."
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <textarea
            id="description"
            name="description"
            value={formData.description}
            placeholder="Add Product Description for customers to easy understand the product details"
            style={{ overflow: "hidden" }}
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="origin">Country of origin</label>
          <img
            title="Enter Product origin country like : India, China, USA, France"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="text"
            id="origin"
            name="origin"
            value={formData.origin}
            placeholder="Ex India China USA"
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="isExpirable">Is product expirable</label>
          <img
            title="Select Yes if product has expiry date else select No"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <select
            name="isExpirable"
            id="isExpirable"
            value={formData.isExpirable}
            onChange={handleExpirableChange}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
        {formData.isExpirable && (
          <div className={style.formInput}>
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
            />
          </div>
        )}
        <div className={style.formInput}>
          <label htmlFor="category">Category</label>
          <img
            title="Select Product Category like : Electronics, Clothing, Books, Home & Kitchen, Beauty & Personal Care, Sports & Outdoors, Toys & Games, Others(if other then write in required field)"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <select
            required
            name="category"
            id="category"
            value={formData.category}
            onChange={handleCategoryChange}
          >
            <option value="">Please select</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Beauty & Personal Care">
              Beauty & Personal Care
            </option>
            <option value="Sports & Outdoors">Sports & Outdoors</option>
            <option value="Toys & Games">Toys & Games</option>
            <option value="Others">Others</option>
          </select>

          {/* Display the input field for other category if "Others" is selected */}
          {formData.category === "Others" && (
            <div className={style.formInput}>
              <label htmlFor="otherCategory">Other Category</label>
              <input
                type="text"
                id="otherCategory"
                name="otherCategory"
                placeholder="Please specify the category"
                value={formData.otherCategory}
                onChange={(e) =>
                  setFormData({ ...formData, otherCategory: e.target.value })
                }
              />
            </div>
          )}
        </div>
        <div className={style.formInput}>
          <label htmlFor="minPrice">Minimum Price</label>
          <img
            title="Enter Product minimum price to attract more buyers"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            className={style.priceRange}
            type="number"
            id="minPrice"
            name="minPrice"
            value={formData.minPrice}
            placeholder="Minimum price"
          />

          <label htmlFor="maxPrice">Maximum Price</label>
          <img
            title="Enter Product maximum price for quality"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            className={style.priceRange}
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={formData.maxPrice}
            placeholder="Maximum price"
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="quantity">Quantity</label>
          <img
            title="Enter Product quantity must be greater and equall to 1"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            placeholder="Product quantity must be >=1"
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="specifications">Specifications</label>
          <img
            title="Enter Product Specifications like : Material: Fabric, Sole: Rubber, Closure: Lace-Up, Toe Style: Round Toe, Warranty: Manufacturer & Seller, Product Dimensions."
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <textarea
            id="specifications"
            name="specifications"
            value={formData.specifications}
            placeholder="Add Product Specifications"
            style={{ overflow: "hidden" }}
          />
        </div>
        <div className={style.upload}>
          <label htmlFor="imageUpload">Image Upload</label>
          <img
            title="Upload Product images for better understanding of product"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="file"
            id="imageUpload"
            name="images"
            accept="image/*"
            multiple
          />
          <small>Upload one or more images for the product</small>
        </div>
        <div className={style.dimensions}>
          <label htmlFor="packagingDimensions">Packaging Dimensions</label>
          <img
            title="Enter Product Packaging Dimensions like : Length, Width, Height(Only packaging dimensions All in CM and mention product dimension in spesification section)"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="number"
            id="length"
            name="length"
            value={formData.length}
            placeholder="Length in CM. only"
          />
          <input
            type="number"
            id="width"
            name="width"
            value={formData.width}
            placeholder="Width in CM. only"
          />
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            placeholder="Height in CM. only"
          />
        </div>

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProducts;
