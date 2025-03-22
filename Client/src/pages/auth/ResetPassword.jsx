import CommonForm from '@/components/common/form';
import { resetPasswordFormControl } from '@/config';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetPassword } from '@/store/auth-slice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const initialState = {
  email: "",
  password: '',
  confirmPassword: '',
};

const ResetPassword = () => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async () => {
    const { email, password, confirmPassword } = formData;

    console.log(formData);
    

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const resultAction = await dispatch(
        resetPassword({ email, password, confirmPassword }) 
        
      );
      console.log(email)

      if (resetPassword.fulfilled.match(resultAction)) {
        toast.success("Password reset successfully!");
        localStorage.removeItem('userId'); // Optional: Clean up localStorage
        navigate("/login");
      } else {
        toast.error(resultAction.payload?.message || "Failed to reset password");
      }
    } catch (err) {
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
      </div>
      <CommonForm
        formControls={resetPasswordFormControl}
        buttonText={"Reset Password"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ResetPassword;
