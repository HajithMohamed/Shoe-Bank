const express = require('express');
const { registerUser, otpVerify, resendOTP, login, logout, forgetPassword, resetPassword, resetPasswordVerify } = require('../controller/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/otp-verify', otpVerify); 
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forget-password', forgetPassword);
router.post('/reset-password-verify', resetPasswordVerify);
router.post('/reset-password', resetPassword);


module.exports = router;