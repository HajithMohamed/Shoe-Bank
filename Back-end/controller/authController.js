const User = require('../model/user');
const catchAsync = require("../util/catchAsync");
const sendEmail = require('../util/email');
const generateOtp = require('../util/generateOtp');
const JWT = require('jsonwebtoken');
const AppError = require('../util/appError');
const Mail = require('nodemailer/lib/mailer');

const signToken = (id) => {
    return JWT.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res, message) => {
    const token = signToken(user._id);

    const cookieOption = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax"
    };
    res.cookie("token", token, cookieOption);
    user.password = undefined;
    user.passwordConfirm = undefined;
    user.otp = undefined;

    res.status(statusCode).json({
        status: "success",
        message,
        token,
        data: {
            user,
        }
    });
};

const registerUser  = catchAsync(async (req, res, next) => {
    const { userName, email, password, confirmPassword } = req.body;

    if (!userName) {
        return next(new AppError("Username is required", 400));
    }

    if (password !== confirmPassword) {
        return next(new AppError("Passwords do not match", 400));
    }

    const checkExistingUser  = await User.findOne({ $or: [{ userName }, { email }] });

    if (checkExistingUser ) {
        return next(new AppError("User  already exists", 400));
    }

    const otp = generateOtp();
    const otpExpires = Date.now() + 24 * 60 * 60 * 1000; // OTP valid for 24 hours

    const newUser  = new User({
        userName,
        email,
        password, 
        otp,
        otpExpires
    });

    try {
     
        const newlyCreatedUser  = await newUser .save();

      
        await sendEmail({
            email: newlyCreatedUser.email,
            subject: "Email Verification - Your OTP Code",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Hello ${newlyCreatedUser.userName || 'User'},</h2>
                    <p>Thank you for registering with us!</p>
                    <p><strong>Your One-Time Password (OTP) for email verification is:</strong></p>
                    <h1 style="color: #007BFF;">${otp}</h1>
                    <p>Please enter this code in the app to complete your verification.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <br />
                    <p>Best regards,<br/>The Team</p>
                </div>
            `
        });
        

        res.status(201).json({
            status: "success",
            message: "User  registered successfully. Please verify your email.",
            data: {
                userId: newlyCreatedUser ._id
            }
        });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return next(new AppError("User  already exists", 400));
        }
        return next(new AppError("Error saving user, try again", 500));
    }
});


const otpVerify = catchAsync(async (req, res, next) => {
    const { userId, otp} = req.body;

    if (!userId || !otp) {
        return next(new AppError("User ID and OTP are required", 400));
    }

    const user = await User.findById(userId);

    if (!user || user.otp.toString() !== otp.toString()) {
        return next(new AppError("Invalid OTP", 400));
    }    
    
    if (Date.now() > new Date(user.otpExpires).getTime()) {
        return next(new AppError("OTP has expired, please request a new OTP", 400));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user.email,
        subject: "Welcome to Shoe Bank 👟✨",
        html: `
          <h1>Welcome to Shoe Bank!</h1>
          <p>Hi ${user.userName},</p>
          <p>Thank you for joining <strong>Shoe Bank</strong>, your one-stop shop for the latest footwear trends.</p>
          <p>We’re excited to have you onboard. Explore our exclusive collections and step up your style!</p>
          <br/>
          <p>Happy Shopping!<br/>The Shoe Bank Team</p>
        `
      });
    createSendToken(user, 200, res, "Email has been verified.");
});

const resendOTP = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError("Email is required to resend OTP", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (user.isVerified) {
        return next(new AppError("This account is already verified", 400));
    }

    const newOTP = generateOtp();
    user.otp = newOTP;
    user.otpExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    try {
        await sendEmail({
            email: user.email,
            subject: "Resend OTP - Verify Your Email for Shoe Bank",
            html: `
                <h1>Email Verification - New OTP</h1>
                <p>Hi ${user.userName},</p>
        
                <p>We received a request to resend your OTP for verifying your email address at <strong>Shoe Bank 👟✨</strong>.</p>
        
                <p>Your new OTP is:</p>
        
                <h2 style="color: #2e6da4;">${newOTP}</h2>
        
                <p><strong>Note:</strong> This OTP is valid for the next 24 hours. Please do not share it with anyone.</p>
        
                <p>If you didn’t request this OTP, you can safely ignore this email.</p>
        
                <br/>
                <p>Best regards,</p>
                <p><strong>The Shoe Bank Team</strong></p>
            `
        });
        

        res.status(200).json({
            status: "success",
            message: "OTP sent successfully."
        });
    } catch (error) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError("Error sending email, please try again."));
    }
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res, "Login successful");
});

const logout = catchAsync(async (req, res, next) => {
    res.cookie("token", "loggedout", {
        expires: new Date(Date.now() + 10 * 100),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({
        status: "success",
        message: "Logged out successfully"
    });
});

const forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    
    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError("No user found", 404));
    }

    const otp = generateOtp();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    await user.save({ validateBeforeSave: false });

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset - Your OTP Code",
            html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Hello ${user.userName || 'User'},</h2>
                <p>We received a request to reset your password.</p>
                <p><strong>Your One-Time Password (OTP) for password reset is:</strong></p>
                <h1 style="color: #007BFF;">${otp}</h1>
                <p>Please enter this code in the app to proceed with resetting your password.</p>
                <p><strong>Note:</strong> This OTP is valid for <strong>5 minutes</strong>.</p>
                <br />
                <p>If you did not request this, please ignore this email.</p>
                <br />
                <p>Best regards,<br/>The Shoe Bank Team 👟</p>
              </div>
            `
          });
          

        res.status(200).json({
            status: "success",
            message: "OTP sent successfully."
        });
    } catch (error) {
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError("Error sending email, please try again."));
    }
});

const resetPasswordVerify = catchAsync(async (req, res, next) => {
    const { userId, otp } = req.body;
  
    if (!userId || !otp) {
      return next(new AppError("User ID and OTP are required", 400));
    }
  
    const user = await User.findById(userId);
  
    if (!user || user.resetPasswordOtp !== otp.toString()) {
      return next(new AppError("Invalid OTP", 400));
    }
  
    if (Date.now() > new Date(user.resetPasswordOtpExpires).getTime()) {
      return next(new AppError("OTP has expired, please request a new OTP", 400));
    }
  
    // OTP verified successfully, mark the user as verified for password reset
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    user.resetPasswordOtpVerify = true; 
    await user.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,   // ✅ Required for frontend check
      status: "success",
      message: "OTP verified successfully. You can now reset your password.",
      data: { user }   // ✅ Optional, if your frontend expects some data
    });
  });
  

const resetPassword = catchAsync(async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    console.log(email);
    console.log(password);
    

    if (password !== confirmPassword) {
        return next(new AppError("Passwords do not match", 400));
    }

    const user = await User.findOne({ email });
    
    

    if (!user) return next(new AppError("User not found", 404));

    // Check if OTP verification is completed
    if (!user.resetPasswordOtpVerify) {
        return next(new AppError("Please verify OTP before resetting your password", 403));
    }

    // Set the new password
    user.password = password;
    await user.save();

    // Send a confirmation email
    await sendEmail({
        email: user.email,
        subject: "Your Shoe Bank Password Was Reset Successfully ✅",
        html: `
          <h1>Password Reset Successful!</h1>
          <p>Hi ${user.userName},</p>
          <p>Your password for <strong>Shoe Bank</strong> was reset successfully.</p>
          <p>If you did not perform this action, please contact our support immediately.</p>
          <br/>
          <p>Thank you for being with us!<br/>The Shoe Bank Team 👟</p>
        `
    });

    createSendToken(user, 200, res, "Password reset successfully.");
});
module.exports = { registerUser, otpVerify, resendOTP, login, logout, forgetPassword, resetPassword, resetPasswordVerify};
