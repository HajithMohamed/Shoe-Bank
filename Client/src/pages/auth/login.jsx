import CommonForm from "@/components/common/form";
import { loginFormControl } from "@/config";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from '@/store/auth-slice'; // Update the path according to your project
import { toast } from "react-toastify";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/dashboard");
      } else if (loginUser.rejected.match(resultAction)) {
        toast.error(resultAction.payload || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Login error:", error);
    }
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
    </div>
  );
}

export default AuthLogin;
