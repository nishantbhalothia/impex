import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    manufacturers: [],
    manufacturer: {},
    loading: false,
    manufacturerId: null,
    pageNumber: 1,
    totalPages: 1,
    };

const manufacturerSlice = createSlice({
    name: "manufacturer",
    initialState,
    reducers: {
        setManufacturers: (state, action) => {
            state.manufacturers = action.payload;
            state.loading = false;
        },
        setManufacturer: (state, action) => {
            state.manufacturer = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setManufacturerId: (state, action) => {
            state.manufacturerId = action.payload;
        },
        setPageNumber: (state, action) => {
            state.pageNumber = action.payload;
        },
        setTotalPages: (state, action) => {
            state.totalPages = action.payload;
        },
    },
});


// Set the base URL for your backend API
const baseURL = 'http://localhost:8080/api/manufacturers'; // Replace with your actual backend URL

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




// =========================================================== fetch all manufacturers ===========================================================
// fronend will call this action creator to fetch all manufacturers and provide the pageNumber
export const fetchManufacturers = (pageNumber) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axiosInstance.get(`/getAll?page=${pageNumber}`);
        dispatch(setManufacturers(response.data.manufacturers));
        dispatch(setPageNumber(response.data.page));
        dispatch(setTotalPages(response.data.pages));

        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}




// =========================================================== fetch manufacturer by id ===========================================================
// frontend will call this action creator to fetch a manufacturer by id
export const fetchManufacturerById = (manufacturerId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axiosInstance.get(`/${manufacturerId}`);
        dispatch(setManufacturer(response.data.manufacturer));
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}


export const { setManufacturers, setManufacturer, setLoading, setManufacturerId, setPageNumber, setTotalPages } = manufacturerSlice.actions;


export const selectManufacturers = (state) => state.manufacturer.manufacturers;
export const selectManufacturer = (state) => state.manufacturer.manufacturer;
export const selectLoading = (state) => state.manufacturer.loading;
export const selectManufacturerId = (state) => state.manufacturer.manufacturerId;
export const selectPageNumber = (state) => state.manufacturer.pageNumber;
export const selectTotalPages = (state) => state.manufacturer.totalPages;


export default manufacturerSlice.reducer;