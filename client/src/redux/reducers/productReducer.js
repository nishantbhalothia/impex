import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  products: [],
  product: {},
  loading: false,
  productId: null,
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
    setProductId: (state, action) => {
      state.productId = action.payload;
    },
  },
});

// Set the base URL for your backend API
const baseURL = 'http://localhost:8080/api/products'; // Replace with your actual backend URL

// Create an Axios instance with configured options
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Send cookies with requests
});

axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('authTokenSeller');
    if (!token) {
      token = document.cookie.replace(/(?:(?:^|.*;\s*)authTokenSeller\s*=\s*([^;]*).*$)|^.*$/, "$1");
    }
    console.log('seller Token @ sellerreducer:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const { status } = error.response;
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        let refreshToken = localStorage.getItem('refreshTokenSeller');
        if (!refreshToken) {
          refreshToken = document.cookie.replace(/(?:(?:^|.*;\s*)refreshTokenSeller\s*=\s*([^;]*).*$)|^.*$/, "$1");
        }
        if (!refreshToken) {
          // Logout if refresh token is not found
          await axiosInstance.post('/logout'); // Assuming a logout endpoint exists
          // Clear tokens from storage
          localStorage.removeItem('authTokenSeller');
          localStorage.removeItem('refreshTokenSeller');
          document.cookie = 'authTokenUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'refreshTokenUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          // Redirect to login page or handle logout action
          console.log('Refresh token not found. Logging out.');
          // Example: window.location.href = '/login';
          return Promise.reject(new Error('Refresh token not found'));
        }
        // Continue with token refresh logic
        const refreshResponse = await axiosInstance.post('/auth/refresh-token', { refreshToken });
        const newAuthToken = refreshResponse.data.token;
        localStorage.setItem('authTokenSeller', newAuthToken);
        localStorage.setItem('refreshTokenSeller', refreshResponse.data.refreshToken);
        // document.cookie = `authTokenUser=${newAuthToken};path=/`;expires=${new Date(new Date().getTime() + 1000 * 60).toUTCString()}`;
        // document.cookie = `refreshTokenUser=${refreshResponse.data.refreshToken};path=/`;expires=${new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7).toUTCString()}`;
        originalRequest.headers.Authorization = `Bearer ${newAuthToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Handle refresh token failure (e.g., redirect to login)
        // For example:
        // window.location.href = '/login'; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // Reject other errors
  }
);

export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.get("/getAllProducts");
    dispatch(setProducts(response.data));
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Fetch products failed:", error.message);
  }
};

export const fetchProduct = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.get(`/get/${id}`);
    dispatch(setProduct(response.data));
    return response;
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Fetch product failed:", error.message);
  }
};

export const addProduct = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post("/addNew", data);
    console.log("Add product response @productReducer:", response.data);
    return response;
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Add product failed:", error.message);
  }
};

export const updateProduct = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.put(`/update/${id}`, data);
    // reset productId after successful update
    dispatch(setProductId(null));
    return response;
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Update product failed:", error.message);
  }
}

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.delete(`/delete/${id}`);
    return response;
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Delete product failed:", error.message);
  }
}

export const { setProducts, setProduct, setLoading, setProductId } = productSlice.actions;

export const selectProducts = (state) => state.product.products;
export const selectProduct = (state) => state.product.product;
export const selectLoading = (state) => state.product.loading;
export const selectProductId = (state) => state.product.productId;


export default productSlice.reducer;