import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  country: "",
  user: [],
  userType: "buyer",
  loading: false,
  isLoggedIn: false,
};
console.log('initialState_user',initialState.user);
const userSlice = createSlice({
  name: "user",
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
const baseURL = 'http://localhost:8080/api/users'; // Replace with your actual backend URL

// Create an Axios instance with configured options
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Send cookies with requests
});

// Add a request interceptor to set the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('authTokenUser');
    if (!token) {
      token = document.cookie.replace(/(?:(?:^|.*;\s*)authTokenUser\s*=\s*([^;]*).*$)|^.*$/, "$1");
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Add a response interceptor to handle token refresh
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
        let refreshToken = localStorage.getItem('refreshTokenUser');
        if (!refreshToken) {
          refreshToken = document.cookie.replace(/(?:(?:^|.*;\s*)refreshTokenUser\s*=\s*([^;]*).*$)|^.*$/, "$1");
        }
        if (!refreshToken) {
          // Logout if refresh token is not found
          await axiosInstance.post('/logout'); // Assuming a logout endpoint exists
          // Clear tokens from storage
          localStorage.removeItem('authTokenUser');
          localStorage.removeItem('refreshTokenUser');
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
        localStorage.setItem('authTokenUser', newAuthToken);
        localStorage.setItem('refreshTokenUser', refreshResponse.data.refreshToken);
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



// =========================================================== register user ===========================================================
export const registerUser = (data) => async (dispatch) => {
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

  // =========================================================== login user ===========================================================
export const loginUser = (data) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post("/signin", data);
      //localStorage.setItem('authTokenUser', response.); // Store token in local storage
      return response;
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Login failed:", error.message);
      // Handle login error
    }
  };

  // =========================================================== logout user ===========================================================
export const logoutUser = () => async (dispatch) => {
    try {
      dispatch(setLoading(true)); 
      const response = await axiosInstance.post('/logout');
      localStorage.removeItem('authTokenUser'); // Remove token on logout
      return response;
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Logout failed:", error.message);
    }
  };

  // =========================================================== fetch user location ===========================================================
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
  


  

export const { setUser, setLoading, setCountry } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectLoading = (state) => state.user.loading;
export const selectCountry = (state) => state.user.country;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;

export default userSlice.reducer;
