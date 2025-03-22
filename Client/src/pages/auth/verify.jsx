import { Button } from '@/components/ui/button';
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { verifyOtp, resendOtp } from '@/store/auth-slice';

const OTPverify = () => {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);
    const email = localStorage.getItem("email");

    const handleChange = (index, event) => {
        const { value } = event.target;
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value.length === 1 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && !otp[index] && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async () => {
        if (otp.includes("")) {
            toast.error('Please enter the complete OTP');
            return;
        }

        const userId = localStorage.getItem("userId");
        if (!userId) {
            toast.error("User ID missing. Please re-register.");
            return;
        }

        const result = await dispatch(verifyOtp({ userId, otp: otp.join('') }));

        if (verifyOtp.fulfilled.match(result)) {
            toast.success("OTP verified successfully!");
            window.location.href = '/users/home';
        } else {
            toast.error(result.payload || "OTP verification failed. Try again.");
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            toast.error("Email not found. Please register again.");
            return;
        }

        const result = await dispatch(resendOtp(email));
        if (resendOtp.fulfilled.match(result)) {
            toast.success(result.payload.message || "OTP resent successfully!");
        } else {
            toast.error(result.payload || "Failed to resend OTP.");
        }
    };

    return (
        <div className='h-screen flex flex-col items-center justify-center'>
            <h1 className='text-2xl mb-4 font-semibold'>Verify Your Email</h1>
            <div className='flex space-x-4'>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        type='text'
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={el => inputRefs.current[index] = el}
                        className='w-20 h-20 rounded-lg bg-gray-200 font-bold text-center text-2xl'
                    />
                ))}
            </div>
            <div className='flex items-center space-x-4 mt-6'>
                <Button onClick={handleSubmit} disabled={isLoading || otp.includes("")}>
                    {isLoading ? 'Verifying...' : 'Submit'}
                </Button>
                <Button className="bg-orange-600" onClick={handleResendOtp}>Re-send OTP</Button>
            </div>
        </div>
    );
};

export default OTPverify;
