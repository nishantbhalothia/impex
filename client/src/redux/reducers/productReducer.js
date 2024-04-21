import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  products: [],
  product: {},
  loading: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});



export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get("http://localhost:8080/api/products");
    dispatch(setProducts(response.data));
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Fetch products failed:", error.message);
  }
};

export const fetchProduct = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`http://localhost:8080/api/products/${id}`);
    dispatch(setProduct(response.data));
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Fetch product failed:", error.message);
  }
};

export const addProduct = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post("http://localhost:8080/api/products/addNew", data);
    return response;
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Add product failed:", error.message);
  }
};

export const updateProduct = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(`http://localhost:8080/api/products/update/${id}`, data);
    return response;
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Update product failed:", error.message);
  }
}

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(`http://localhost:8080/api/products/delete/${id}`);
    return response;
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Delete product failed:", error.message);
  }
}

export const { setProducts, setProduct, setLoading } = productSlice.actions;

export const selectProducts = (state) => state.product.products;
export const selectProduct = (state) => state.product.product;
export const selectLoading = (state) => state.product.loading;


export default productSlice.reducer;