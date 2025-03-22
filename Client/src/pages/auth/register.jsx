import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/toast"; 
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();


  const isLoading = useSelector((state) => state.auth.isLoading);

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      console.log("Register Response:", data);

      if (data.type === "auth/register/fulfilled") {
        toast({ title: data?.payload?.message, variant: "success" });
        navigate("/auth/verify");
      } else {
        if (data?.payload?.includes("E11000 duplicate key error")) {
          toast({ 
            title: "Username already exists. Please choose a different username.", 
            variant: "destructive" 
          });
        } else {
          toast({ title: data?.payload || "Registration failed", variant: "destructive" });
        }
      }
    });
    
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={isLoading ? "Signing Up..." : "Sign Up"}  // ✅ Dynamic button text
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isLoading={isLoading}  // ✅ Optional: Pass isLoading if CommonForm handles spinner
      />
    </div>
  );
}

export default AuthRegister;