"use client";

import React, { useState } from "react";
import style from "@/Styles/Products/AddProducts.module.css";
import { addProduct } from "@/redux/reducers/productReducer";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const AddProducts = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [isExpirable, setIsExpirable] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);

    // If "Others" is selected, show the other category input field
    if (value === "Others") {
      setOtherCategory("");
    }
  };

  const handleExpirableChange = (event) => {
    setIsExpirable(event.target.value);
    // Clear the expiry date when "No" is selected
    if (event.target.value === false) {
      setExpiryDate(false);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    console.log("Form:", form);

    for (item of form) {
      console.log("Item:", item[0]), item[1];}
    const formData = new FormData(form);

    console.log("Form data @AddProducts:", formData);

    // If "Others" is selected, add the other category to the form data
    if (selectedCategory === "Others") {
      formData.append("otherCategory", otherCategory);
    }

    // If "Yes" is selected, add the expiry date to the form data
    if (isExpirable === "true") {
      formData.append("expiryDate", expiryDate);
    }

    const response = await dispatch(addProduct(formData));
    // if (response.status === 200) {
    //   alert("Product added successfully");
    //   router.push("/sellers/profile");
    // } else {
    //   alert("Failed to add product");
    // }
  };

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={submitHandler}  encType="multipart/form-data">
        <div className={style.formInput}>
          <label htmlFor="name">Product Name</label>
          <img
            className={style.question}
            title="Enter Product name like : Puma shoes with soft gel sole white and read thread breathable fabric daily use"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Product name and can add related Keywords and Phrases"
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="brandName">Brand Name</label>
          <img
            className={style.question}
            title="Enter Product Brand Name like : Puma, Adidas, Crosair, Dell"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="text"
            id="brandName"
            name="brandName"
            placeholder="Ex Bhalothia.com Puma Samsung Sony Dell"
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="manufacurer">Manufacturer</label>
          <img
            className={style.question}
            title="Enter Product manufacturer Like: xyz pvt ltd (if multiple manufacturers then enter all)"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="text"
            id="manufacurer"
            name="manufacurer"
            placeholder="Ex xyx pvt ltd"
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="description">Description</label>
          <img
            className={style.question}
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
            placeholder="Add Product Description for customers to easy understand the product details"
            style={{overflow:"hidden"}}
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="origin">Country of origin</label>
          <img
            className={style.question}
            title="Enter Product origin country like : India, China, USA, France"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="text"
            id="origin"
            name="origin"
            placeholder="Ex India China USA"
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="isExpirable">Is product expirable</label>
          <img
            className={style.question}
            title="Select Yes if product has expiry date else select No"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <select
            name="isExpirable"
            id="isExpirable"
            value={isExpirable}
            onChange={handleExpirableChange}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
        {isExpirable === "true" && (
          <div className={style.formInput}>
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
        )}
        <div className={style.formInput}>
          <label htmlFor="category">Category</label>
          <img
            className={style.question}
            title="Select Product Category like : Electronics, Clothing, Books, Home & Kitchen, Beauty & Personal Care, Sports & Outdoors, Toys & Games, Others(if other then write in required field)"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <select
            required
            name="category"
            id="category"
            value={selectedCategory}
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
          {selectedCategory === "Others" && (
            <div className={style.formInput}>
              <label htmlFor="otherCategory">Other Category</label>
              <input
                type="text"
                id="otherCategory"
                name="otherCategory"
                placeholder="Please specify the category"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className={style.formInput}>
          <label htmlFor="minPrice">Minimum Price</label>
          <img
            className={style.question}
            title="Enter Product minimum price to attract more buyers"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            className={style.priceRange}
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Minimum price"
          />

          <label htmlFor="maxPrice">Maximum Price</label>
          <img
            className={style.question}
            title="Enter Product maximum price for quality"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            className={style.priceRange}
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="Maximum price"
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="quantity">Quantity</label>
          <img
            className={style.question}
            title="Enter Product quantity must be greater and equall to 1"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Product quantity must be >=1"
          />
        </div>
        <div className={style.formInput}>
          <label htmlFor="specifications">Specifications</label>
          <img
            className={style.question}
            title="Enter Product Specifications like : Material: Fabric, Sole: Rubber, Closure: Lace-Up, Toe Style: Round Toe, Warranty: Manufacturer & Seller, Product Dimensions."
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <textarea
            id="specifications"
            name="specifications"
            placeholder="Add Product Specifications"
            style={{overflow:"hidden"}}
          />
        </div>
        <div className={style.upload}>
          <label htmlFor="imageUpload">Image Upload</label>
          <img
            className={style.question}
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
            className={style.question}
            title="Enter Product Packaging Dimensions like : Length, Width, Height(Only packaging dimensions All in CM and mention product dimension in spesification section)"
            src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
            alt="required"
          />
          <input
            type="number"
            id="length"
            name="length"
            placeholder="Length in CM. only"
          />
          <input
            type="number"
            id="width"
            name="width"
            placeholder="Width in CM. only"
          />
          <input
            type="number"
            id="height"
            name="height"
            placeholder="Height in CM. only"
          />
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProducts;




// "use client";

// import React, { useState } from "react";
// import style from "@/Styles/Products/AddProducts.module.css";
// import { addProduct } from "@/redux/reducers/productReducer";
// import { useDispatch } from "react-redux";
// import { useRouter } from "next/navigation";

// const AddProducts = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: "",
//     brandName: "",
//     manufacturer: "",
//     description: "",
//     origin: "",
//     isExpirable: false,
//     expiryDate: "",
//     category: "",
//     otherCategory: "",
//     minPrice: "",
//     maxPrice: "",
//     quantity: "",
//     specifications: "",
//     images: [], // array to hold selected images
//     length: "",
//     width: "",
//     height: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setFormData((prevData) => ({ ...prevData, images: files }));
//   };

//   const handleExpirableChange = (e) => {
//     const value = e.target.value === "true"; // convert string to boolean
//     setFormData((prevData) => ({ ...prevData, isExpirable: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form data @AddProducts:", formData);
//     const response = await dispatch(addProduct(formData));
//     console.log("Response:", response);
//     // if (response.status === 200) {
//     //   alert("Product added successfully");
//     //   router.push("/sellers/profile");
//     // } else {
//     //   alert("Failed to add product");
//     // }
//   };


//   return (
//     <div className={style.container}>
//       <form className={style.form} onSubmit={handleSubmit}  encType="multipart/form-data">
//         <div className={style.formInput}>
//           <label htmlFor="name">Product Name</label>
//           <img
//             className={style.question}
//             title="Enter Product name like : Puma shoes with soft gel sole white and read thread breathable fabric daily use"
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <input
//             type="text"
//             id="name"
//             name="name"
//             placeholder="Product name and can add related Keywords and Phrases"
//             onChange={handleChange}
//           />
//         </div>
//         <div className={style.formInput}>
//           <label htmlFor="brandName">Brand Name</label>
//           <img
//             className={style.question}
//             title="Enter Product Brand Name like : Puma, Adidas, Crosair, Dell"
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <input
//             type="text"
//             id="brandName"
//             name="brandName"
//             placeholder="Ex Bhalothia.com Puma Samsung Sony Dell"
//             onChange={handleChange}
//           />
//         </div>
//         <div className={style.formInput}>
//           <label htmlFor="manufacurer">Manufacturer</label>
//           <img
//             className={style.question}
//             title="Enter Product manufacturer Like: xyz pvt ltd (if multiple manufacturers then enter all)"
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <input
//             type="text"
//             id="manufacturer"
//             name="manufacturer"
//             placeholder="Ex xyx pvt ltd"
//             onChange={handleChange}
//           />
//         </div>
//         <div className={style.formInput}>
//           <label htmlFor="description">Description</label>
//           <img
//             className={style.question}
//             title="Provide full Description about porduct like:Experience ultimate comfort and style with our innovative Puma shoes. 
//             Crafted with a breathable fabric that keeps your feet cool and dry, these shoes feature a soft sole for unparalleled cushioning and support. 
//             Not only are they incredibly comfortable, but they are also washable, making them easy to clean and maintain. 
//             Step into a new level of comfort and performance with Puma Breathable Shoes."
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <textarea
//             id="description"
//             name="description"
//             placeholder="Add Product Description for customers to easy understand the product details"
//             onChange={handleChange}
//             style={{overflow: "hidden"}}
//           />
//         </div>
//         <div className={style.formInput}>
//           <label htmlFor="origin">Country of origin</label>
//           <img
//             className={style.question}
//             title="Enter Product origin country like : India, China, USA, France"
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <input
//             type="text"
//             id="origin"
//             name="origin"
//             placeholder="Ex India China USA"
//             onChange={handleChange}
//           />
//         </div>
//         <div className={style.formInput}>
//           <label htmlFor="isExpirable">Is product expirable</label>
//           <img
//             className={style.question}
//             title="Select Yes if product has expiry date else select No"
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <select
//             name="isExpirable"
//             id="isExpirable"
//             value={formData.isExpirable}
//             onChange={handleExpirableChange}
//           >
//             <option value={false}>No</option>
//             <option value={true}>Yes</option>
//           </select>
//         </div>
//         {formData.isExpirable === true && (
//           <div className={style.formInput}>
//             <label htmlFor="expiryDate">Expiry Date</label>
//             <input
//               type="date"
//               id="expiryDate"
//               name="expiryDate"
//               value={formData.expiryDate}
//               onChange={handleChange}
//             />
//           </div>
//         )}
//         <div className={style.formInput}>
//           <label htmlFor="category">Category</label>
//           <img
//             className={style.question}
//             title="Select Product Category like : Electronics, Clothing, Books, Home & Kitchen, Beauty & Personal Care, Sports & Outdoors, Toys & Games, Others(if other then write in required field)"
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <select
//             required
//             name="category"
//             id="category"
//             value={formData.selectedCategory}
//             onChange={handleChange}
//           >
//             <option value="">Please select</option>
//             <option value="Electronics">Electronics</option>
//             <option value="Clothing">Clothing</option>
//             <option value="Books">Books</option>
//             <option value="Home & Kitchen">Home & Kitchen</option>
//             <option value="Beauty & Personal Care">
//               Beauty & Personal Care
//             </option>
//             <option value="Sports & Outdoors">Sports & Outdoors</option>
//             <option value="Toys & Games">Toys & Games</option>
//             <option value="Others">Others</option>
//           </select>

//           {/* Display the input field for other category if "Others" is selected */}
//         {formData.category === "Others" && (
//           <div className={style.formInput}>
//             <label htmlFor="otherCategory">Other Category</label>
//             <input
//               type="text"
//               id="otherCategory"
//               name="otherCategory"
//               placeholder="Please specify the category"
//               value={formData.otherCategory}
//               onChange={handleChange}
//             />
//           </div>
//         )}
//         </div>
//         <div className={style.formInput}>
//           <label htmlFor="minPrice">Minimum Price</label>
//           <img
//             className={style.question}
//             title="Enter Product minimum price to attract more buyers"
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <input
//             className={style.priceRange}
//             type="number"
//             id="minPrice"
//             name="minPrice"
//             placeholder="Minimum price"
//             onChange={handleChange}
//           />

//           <label htmlFor="maxPrice">Maximum Price</label>
//           <img
//             className={style.question}
//             title="Enter Product maximum price for quality"
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <input
//             className={style.priceRange}
//             type="number"
//             id="maxPrice"
//             name="maxPrice"
//             placeholder="Maximum price"
//             onChange={handleChange}
//           />
//         </div>
//         <div className={style.formInput}>
//           <label htmlFor="quantity">Quantity</label>
//           <img
//             className={style.question}
//             title="Enter Product quantity must be greater and equall to 1"
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <input
//             type="number"
//             id="quantity"
//             name="quantity"
//             placeholder="Product quantity must be >=1"
//             onChange={handleChange}
//           />
//         </div>
//         <div className={style.formInput}>
//           <label htmlFor="specifications">Specifications</label>
//           <img
//             className={style.question}
//             title="Enter Product Specifications like : Material: Fabric, Sole: Rubber, Closure: Lace-Up, Toe Style: Round Toe, Warranty: Manufacturer & Seller, Product Dimensions."
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <textarea
//             id="specifications"
//             name="specifications"
//             placeholder="Add Product Specifications"
//             onChange={handleChange}
//             style={{overflow: "hidden"}}
//           />
//         </div>
//         <div className={style.upload}>
//           <label htmlFor="imageUpload">Image Upload</label>
//           <img
//             className={style.question}
//             title="Upload Product images for better understanding of product"
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <input
//             type="file"
//             id="imageUpload"
//             name="images"
//             accept="image/*"
//             multiple
//             onChange={handleFileChange} 
//           />
//           <small>Upload one or more images for the product</small>
//         </div>
//         <div className={style.dimensions}>
//           <label htmlFor="packagingDimensions">Packaging Dimensions</label>
//           <img
//             className={style.question}
//             title="Enter Product Packaging Dimensions like : Length, Width, Height(Only packaging dimensions All in CM and mention product dimension in spesification section)"
//             src="https://cdn-icons-png.flaticon.com/128/471/471664.png"
//             alt="required"
//           />
//           <input
//             type="number"
//             id="length"
//             name="length"
//             placeholder="Length in CM. only"
//             onChange={handleChange}
//           />
//           <input
//             type="number"
//             id="width"
//             name="width"
//             placeholder="Width in CM. only"
//             onChange={handleChange}
//           />
//           <input
//             type="number"
//             id="height"
//             name="height"
//             placeholder="Height in CM. only"
//             onChange={handleChange}
//           />
//         </div>

//         <button type="submit">Add Product</button>
//       </form>
//     </div>
//   );
// };

// export default AddProducts;
