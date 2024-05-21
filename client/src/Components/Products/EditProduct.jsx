"use client";

import React, { useState, useEffect } from "react";
import styles from "@/Styles/Products/AddProducts.module.css";
import {
  addProduct,
  deleteImage,
  fetchProduct,
  selectProductId,
  updateProduct,
  selectProduct,
} from "@/redux/reducers/productReducer";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectLoading } from "@/redux/reducers/userReducer";

// when seller logged in then all products are fetched from the database and displayed in the seller profile page and stored in the redux store
// so we can use the useSelector(selectproducts) selectProducts is exported from the productReducer.js file
// then we can use filter method to filter out the product with the id that we want to update, it well reduce load on the server

const EditProducts = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [isExpirable, setIsExpirable] = useState(false);
  const [expiryDate, setExpiryDate] = useState(false);
  const productId = useSelector(selectProductId);
  const productData = useSelector(selectProduct);
  console.log("Product data @EditProducts:", productData);
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
    images: [],
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await dispatch(fetchProduct(productId));
        const productData = response.data.product;
        console.log("Product data:", productData);
        // Update the form data state with fetched data
        setFormData((prevData) => ({
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
          images: productData.images || [],
        }));
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [dispatch, productId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  // ===================================================================== form submit handler =============================================================================
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
    const response = await dispatch(updateProduct(productId, data));
    console.log("Updated product respone", response);
    if (response?.status === 200) {
      alert("Product updated successfully");
      router.push("/sellers/profile");
    } else {
      alert("Failed to add product");
    }

    // Clear the form
    // form.reset();
  };

  //  Delete the images from the form database as we are storing the images in the cloudinary
  const imageDeletionHandler = async (imageId) => {
    console.log("Delete image @EditProduct:", productId, imageId);

    // ============================================== work to be done on image deletion  ==================================================================
    const response = await dispatch(deleteImage(productId, imageId));
    console.log("Delete image response @Edit Product:", response);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={submitHandler}>
        <div className={styles.formInput}>
          <label htmlFor="name">Product Name</label>
          <img
            className={styles.question}
            title="Enter Product name like : Puma shoes with soft gel sole white and read thread breathable fabric daily use"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product name and can add related Keywords and Phrases"
          />
        </div>
        <div className={styles.formInput}>
          <label htmlFor="brandName">Brand Name</label>
          <img
            className={styles.question}
            title="Enter Product Brand Name like : Puma, Adidas, Crosair, Dell"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={formData.brandName}
            onChange={handleInputChange}
            placeholder="Bhalothia.com Puma Samsung Sony Dell"
          />
        </div>
        <div className={styles.formInput}>
          <label htmlFor="manufacturer">Manufacturer</label>
          <img
            className={styles.question}
            title="Enter Product manufacturer Like: xyz pvt ltd (if multiple manufacturers then enter all)"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="text"
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            placeholder="xyz pvt ltd"
          />
        </div>
        <div className={styles.formInput}>
          <label htmlFor="description">Description</label>
          <img
            className={styles.question}
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
            onChange={handleInputChange}
            placeholder="Add Product Description for customers to easy understand the product details"
            styles={{ overflow: "hidden" }}
          />
        </div>
        <div className={styles.formInput}>
          <label htmlFor="origin">Country of origin</label>
          <img
            className={styles.question}
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
        <div className={styles.formInput}>
          <label htmlFor="isExpirable">Is product expirable</label>
          <img
            className={styles.question}
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
          <div className={styles.formInput}>
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
        <div className={styles.formInput}>
          <label htmlFor="category">Category</label>
          <img
            className={styles.question}
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
            <div className={styles.formInput}>
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
        <div className={styles.formInput}>
          <label htmlFor="minPrice">Minimum Price</label>
          <img
            className={styles.question}
            title="Enter Product minimum price to attract more buyers"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            className={styles.priceRange}
            type="number"
            id="minPrice"
            name="minPrice"
            value={formData.minPrice}
            placeholder="Minimum price"
          />

          <label htmlFor="maxPrice">Maximum Price</label>
          <img
            className={styles.question}
            title="Enter Product maximum price for quality"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            className={styles.priceRange}
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={formData.maxPrice}
            placeholder="Maximum price"
          />
        </div>
        <div className={styles.formInput}>
          <label htmlFor="quantity">Quantity</label>
          <img
            className={styles.question}
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
        <div className={styles.formInput}>
          <label htmlFor="specifications">Specifications</label>
          <img
            className={styles.question}
            title="Enter Product Specifications like : Material: Fabric, Sole: Rubber, Closure: Lace-Up, Toe Style: Round Toe, Warranty: Manufacturer & Seller, Product Dimensions."
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <textarea
            id="specifications"
            name="specifications"
            value={formData.specifications}
            placeholder="Add Product Specifications"
            styles={{ overflow: "hidden" }}
          />
        </div>
        <div className={styles.upload}>
          <label htmlFor="imageUpload">Image Upload</label>
          <img
            className={styles.question}
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
        <div className={styles.formInput}>
          {formData.images.map((imageUrl, index) => (
            <div className={styles.thumbnailContainer}>
              <img
                key={index}
                src={imageUrl.url}
                alt={`Image ${index}`}
                className={styles.thumbnail}
              />
              <img
                onClick={() => imageDeletionHandler(imageUrl._id)}
                className={styles.deleteButton}
                src="https://cdn-icons-png.flaticon.com/128/5610/5610967.png"
                alt="delete"
                title="Delete image permanently "
              />
            </div>
          ))}
        </div>
        <div className={styles.dimensions}>
          <label htmlFor="packagingDimensions">Packaging Dimensions</label>
          <img
            className={styles.question}
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
