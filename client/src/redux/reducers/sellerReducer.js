import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  country: "",
  user: [],
  userType: "seller",
  loading: false,
  isLoggedIn: false,
};
console.log('initialState_user',initialState.user);
const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.loading = false;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
//   extraReducers: (builder) => {
//     builder.addCase(registerUser.pending, (state) => {
//       state.loading = true;
//     });
//     builder.addCase(registerUser.fulfilled, (state, action) => {
//       state.user = action.payload;
//       state.loading = false;
//     });
//     builder.addCase(registerUser.rejected, (state, action) => {
//       state.loading = false;
//       console.error("Registration failed:", action.error.message);
//     });
//   },
});

// Set the base URL for your backend API
const baseURL = 'http://localhost:8080/api/sellers'; // Replace with your actual backend URL

// Create an Axios instance with configured options
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Send cookies with requests
});

export const registerSeller = (data) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post("/register", data);
      console.log('response',response);
      return response;
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Registration failed:", error.message);
      // Handle registration error
    }
  };

export const loginUser = (data) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post("/signin", data);
      return response;
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Login failed:", error.message);
      // Handle login error
    }
  };

export const getLocation = () => async (dispatch) => {
  const getCountryFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      if (!response.ok) {
        throw new Error('Failed to fetch country information');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching country:', error.message);
      return null;
    }
  };
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const data = await getCountryFromCoordinates(latitude, longitude);
            console.log('User country:', data.countryName);
            dispatch(setCountry(data.countryName));
            console.log('User Location Data',data);
            return data;
          },
          (error) => {
            console.error('Error getting location:', error);
            // Handle error (e.g., display a message to the user)
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        // Handle unsupported browser (e.g., display a message to the user)
      }
    } catch (error) {
      console.error("Failed to fetch country:", error.message);
    }
  };
  


  

export const { setUser, setLoading, setCountry } = sellerSlice.actions;

export const selectUser = (state) => state.seller.user;
export const selectLoading = (state) => state.seller.loading;
export const selectCountry = (state) => state.seller.country;
export const selectIsLoggedIn = (state) => state.seller.isLoggedIn;

export default sellerSlice.reducer;
