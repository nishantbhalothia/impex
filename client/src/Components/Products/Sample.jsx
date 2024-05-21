"use client";
import React, { useState } from "react";

const Sample = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append('name', name);
    // formData.append('description', description);
    // formData.append('images', e.target.images.files);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    // Append each file individually
    for (const file of e.target.images.files) {
      formData.append("images", file);
    }

    const response = await fetch(
      "http://localhost:8080/api/products/addImage",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={submitHandler} encType="multipart/form-data">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label htmlFor="images">Upload images:</label>
        <input type="file" name="images" id="images" multiple />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Sample;
