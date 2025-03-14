import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
};

// **Register User Async Thunk**
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/register",
        formData,
        { withCredentials: true }
      );

      const userId = response.data.data.userId; // Extract userId
      localStorage.setItem("userId", userId);  // Store userId for OTP verification

      toast.success("Registration successful!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);


// **OTP Verification Async Thunk**
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/otp-verify",
        { userId, otp }, 
        { withCredentials: true }
      );
      toast.success("Verification successful!");
      return response.data.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed.");
      return rejectWithValue(error.response?.data?.message || "Verification failed.");
    }
  }
);


// **Auth Slice**
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // **Handle Register**
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // **Handle OTP Verification**
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// **Export Actions & Reducer**
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
