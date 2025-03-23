import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { resetPasswordVerify, forgotPassword } from '@/store/auth-slice'; // ✅ added forgotPassword import
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ResetPasswordVerify = ({ otpLength = 4 }) => {
  const [otp, setOtp] = useState(Array(otpLength).fill(''));
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    try {
      const enteredOtp = otp.join('');
      if (enteredOtp.length !== otpLength) {
        toast.error("Please enter the full OTP");
        return;
      }
  
      await dispatch(resetPasswordVerify({ userId, otp: enteredOtp })).unwrap();
  
      toast.success("OTP Verified Successfully");
      navigate('/auth/reset-password');
  
    } catch (err) {
      console.error("Error during OTP verification:", err);
      toast.error(typeof err === 'string' ? err : (err?.message || "OTP Verification failed"));
    }
  };
  
  
  

  const handleResend = async () => {
    setIsResending(true);
    const email = localStorage.getItem('email'); // Assuming email is stored in localStorage

    try {
      await dispatch(forgotPassword(email)).unwrap();
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
    setIsResending(false);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-semibold text-center mb-4">Enter Security Code</h1>
        <p className="text-center text-gray-600 mb-6">
          Please check your email for a message with your code. Your code is {otpLength} numbers long.
        </p>

        <div className="flex justify-center space-x-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 rounded-lg bg-gray-100 text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <p className="text-center text-gray-600 mb-6">We sent your code to your registered email address.</p>

        <div className="flex justify-between items-center">
          <Button onClick={handleSubmit} className="w-1/2 mr-2">
            Submit
          </Button>
          <Button
            className="w-1/2 bg-orange-600"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Re-send OTP'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordVerify;
