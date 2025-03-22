import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import CommonForm from '@/components/common/form'; 
import { forgetPasswordFormControll } from '@/config';
import { forgotPassword } from '@/store/auth-slice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const initialState = { email: "" };

const Forgot = () => {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false); // State for button loading
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state
    dispatch(forgotPassword(formData.email))
      .then((data) => {
        if (data.type === "auth/forgot/fulfilled") {
          toast.success(data.payload.message);
          navigate("/auth/reset-password-verify");
        } else {
          toast.error(data.payload || "Failed to send code");
        }
      })
      .finally(() => setIsLoading(false)); // Reset loading state
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Enter your email to get the reset code
        </h1>
      </div>
      <CommonForm
        formControls={forgetPasswordFormControll}
        buttonText={isLoading ? "Sending..." : "Get Code"} // Dynamic button text
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isLoading={isLoading} // Pass loading state to CommonForm
      />
    </div>
  );
};

export default Forgot;
