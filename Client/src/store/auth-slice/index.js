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

// ✅ Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/register",
        formData,
        { withCredentials: true }
      );
      const userId = response.data.data.userId;
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", formData.email);
      toast.success("Registration successful!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// ✅ Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/otp-verify",
        { userId, otp },
        { withCredentials: true }
      );
      toast.success("OTP verification successful!");
      return response.data.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
      return rejectWithValue(error.response?.data?.message || "Verification failed");
    }
  }
);

// ✅ Resend OTP
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/resend-otp",
        { email },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to resend OTP");
    }
  }
);

// ✅ Forgot Password - Send OTP to email
export const forgotPassword = createAsyncThunk(
  "auth/forgot",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/forget-password",
        { email },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset password OTP"
      );
    }
  }
);

// ✅ Reset Password - Verify OTP
export const resetPasswordVerify = createAsyncThunk(
  "auth/resetPasswordVerify",
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/reset-password-verify",
        { userId, otp },
        { withCredentials: true }
      );
      toast.success("OTP verified for password reset!");
      return response.data.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      return rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
  }
);

// ✅ Reset Password - Set New Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, newPassword, confirmNewPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/reset-password",
        { email, newPassword, confirmNewPassword },
        { withCredentials: true }
      );
      toast.success("Password reset successful!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
      return rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);

// ✅ Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ✅ Register
      .addCase(registerUser.pending, (state) => { state.isLoading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ OTP Verify
      .addCase(verifyOtp.pending, (state) => { state.isLoading = true; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Resend OTP
      .addCase(resendOtp.pending, (state) => { state.isLoading = true; })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message || "OTP resent successfully!");
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to resend OTP");
      })

      // ✅ Forgot Password (SEND OTP)
      .addCase(forgotPassword.pending, (state) => { state.isLoading = true; })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message || "OTP sent successfully!");
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to send reset password code");
      })

      // ✅ Reset Password Verify OTP
      .addCase(resetPasswordVerify.pending, (state) => { state.isLoading = true; })
      .addCase(resetPasswordVerify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(resetPasswordVerify.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Reset Password Final Step
      .addCase(resetPassword.pending, (state) => { state.isLoading = true; })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Password updated successfully!");
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export Actions and Reducer
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
