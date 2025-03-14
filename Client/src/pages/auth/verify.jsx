import { Button } from '@/components/ui/button';
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Correct import statement
import { verifyOtp } from '@/store/auth-slice'; // Correct import path

const OTPverify = () => {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.auth); // Get loading state from Redux

    const handleChange = (index, event) => {
        const { value } = event.target;
        if (/^\d*$/.test(value)) { // Only allow numeric input
            const newOTP = [...otp];
            newOTP[index] = value;
            setOtp(newOTP);

            if (value.length === 1 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && !inputRefs.current[index]?.value && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        if (otp.includes("")) {
            toast.error('Please enter all digits');  // Error notification
            return;
        }

        const userId = localStorage.getItem("userId"); 
        if (!userId) {
            toast.error("User ID is missing, please re-register.");  // Error notification
            return;
        }

        const result = await dispatch(verifyOtp({ userId, otp: otp.join('') }));

        if (verifyOtp.fulfilled.match(result)) {
            toast.success("OTP verified successfully!");  // Success notification
            navigate('/users/home');
            console.log("Logged in successfully");
        } else {
            toast.error("OTP verification failed. Please try again.");  // Error notification
        }
    };

    return (
        <div className='h-screen flex flex-col items-center justify-center'>
            <h1 className='text-2xl mb-4 font-semibold'>
                Enter Your Email Verification
            </h1>
            <div className='flex space-x-4'>
                {otp.map((_, index) => (
                    <input
                        type='number'
                        key={index}
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={el => inputRefs.current[index] = el}
                        className='w-20 h-20 rounded-lg bg-gray-200 font-bold text-center no-spinner'
                        inputMode='numeric'
                    />
                ))}
            </div>
            <div className='flex items-center space-x-4 mt-6'>
                <Button variant={"default"} onClick={handleSubmit} disabled={isLoading || otp.includes("")}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
                <Button className="bg-orange-600">Re-send OTP</Button>
            </div>
        </div>
    );
};

export default OTPverify;
