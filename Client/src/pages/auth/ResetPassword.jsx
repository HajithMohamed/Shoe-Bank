import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetPassword } from '@/store/auth-slice';
import { useNavigate } from 'react-router-dom';
import CommonForm from '@/components/common/form';
import { resetPasswordFormControl } from '@/config';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ email: "", password: '', confirmPassword: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async () => {
    const { email, password, confirmPassword } = formData;
    if (password !== confirmPassword) return;
    const result = await dispatch(resetPassword({ email, password, confirmPassword }));
    if (resetPassword.fulfilled.match(result)) {
      localStorage.removeItem('userId');
      navigate("/login");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>
      <CommonForm
        formControls={resetPasswordFormControl}
        buttonText="Reset Password"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ResetPassword;
