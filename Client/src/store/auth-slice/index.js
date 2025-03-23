import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
};

// ✅ Register
export const registerUser = createAsyncThunk("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:8000/api/auth/register", formData, { withCredentials: true });
    localStorage.setItem("userId", response.data.data.userId);
    localStorage.setItem("email", formData.email);
    toast.success("Registration successful!");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Registration failed";
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk("auth/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:8000/api/auth/login", formData, { withCredentials: true });

    // Store user ID and email locally if needed
    localStorage.setItem("userId", response.data.data.user._id);
    localStorage.setItem("email", response.data.data.user.email);

    toast.success(response.data.message || "Login successful!");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Incorrect email or password";
    toast.error(message);
    return rejectWithValue(message);
  }
});

// ✅ OTP Verification
export const verifyOtp = createAsyncThunk("auth/verifyOtp", async ({ userId, otp }, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:8000/api/auth/otp-verify", { userId, otp }, { withCredentials: true });
    toast.success("OTP verification successful!");
    return response.data.data.user;
  } catch (error) {
    const message = error.response?.data?.message || "OTP verification failed";
    toast.error(message);
    return rejectWithValue(message);
  }
});

// ✅ Resend OTP
export const resendOtp = createAsyncThunk("auth/resendOtp", async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:8000/api/auth/resend-otp", { email }, { withCredentials: true });
    toast.success(response.data.message || "OTP resent successfully!");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to resend OTP";
    toast.error(message);
    return rejectWithValue(message);
  }
});

// ✅ Forgot Password - Send Reset OTP
export const forgotPassword = createAsyncThunk("auth/forgot", async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:8000/api/auth/forget-password", { email }, { withCredentials: true });
    toast.success(response.data.message || "Reset code sent to email!");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to send reset code";
    toast.error(message);
    return rejectWithValue(message);
  }
});

// ✅ Reset Password OTP Verify
export const resetPasswordVerify = createAsyncThunk(
  "auth/resetPasswordVerify",
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/reset-password-verify",
        { userId, otp },
        { withCredentials: true }
      );

      if (response.data?.success) {
        return response.data.data?.user || {}; 
      } else {
        return rejectWithValue(response.data.message || "OTP verification failed");
      }

    } catch (error) {
      const message = error.response?.data?.message || "OTP verification failed";
      return rejectWithValue(message);
    }
  }
);

// ✅ Reset Password Final Step
export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ email, password, confirmPassword }, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:8000/api/auth/reset-password", { email, password, confirmPassword }, { withCredentials: true });
    toast.success("Password reset successful!");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Password reset failed";
    toast.error(message);
    return rejectWithValue(message);
  }
});

// ✅ Slice
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
      .addCase(registerUser.pending, (state) => { state.isLoading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(verifyOtp.pending, (state) => { state.isLoading = true; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(resendOtp.pending, (state) => { state.isLoading = true; })
      .addCase(resendOtp.fulfilled, (state) => { state.isLoading = false; })
      .addCase(resendOtp.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(forgotPassword.pending, (state) => { state.isLoading = true; })
      .addCase(forgotPassword.fulfilled, (state) => { state.isLoading = false; })
      .addCase(forgotPassword.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(resetPasswordVerify.pending, (state) => { state.isLoading = true; })
      .addCase(resetPasswordVerify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(resetPasswordVerify.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(resetPassword.pending, (state) => { state.isLoading = true; })
      .addCase(resetPassword.fulfilled, (state) => { state.isLoading = false; })
      .addCase(resetPassword.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
