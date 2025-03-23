import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '@/store/auth-slice';
import { useNavigate } from 'react-router-dom';
import CommonForm from '@/components/common/form';
import { forgetPasswordFormControll } from '@/config';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword(formData.email));
    if (forgotPassword.fulfilled.match(result)) navigate("/auth/reset-password-verify");
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <h1 className="text-3xl font-bold text-center">Enter your email to get the reset code</h1>
      <CommonForm
        formControls={forgetPasswordFormControll}
        buttonText={"Get Code"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ForgotPassword;
