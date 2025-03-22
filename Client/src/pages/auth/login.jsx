import CommonForm from "@/components/common/form";
import { loginFormControl } from "@/config";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();

  function onSubmit() {
    // Add your form submission logic here
    // On successful login, navigate to the desired page
    navigate("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link to="/auth/register" className="font-medium ml-2 text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControl}
        buttonText={"Sign In"} 
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isLoginForm={true} 
      />
      <div className="text-center mt-4">
        
      </div>
    </div>
  );
}

export default AuthLogin;
