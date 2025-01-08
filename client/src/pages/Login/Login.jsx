import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { postRequest } from "../../components/Axios/api"; // Import API functions

import InputField from "../../components/Shared/InputField";
import { useAuth } from "../../context/AuthProvider";

const Login = () => {
  const [userCred, setUserCred] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [inputError, setInputError] = useState("");
  const navigate = useNavigate();

  const auth = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCred((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { email, password } = userCred;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    // if (!password.trim()) {
    //   newErrors.password = "Password is required";
    // } else if (password.length < 6) {
    //   newErrors.password = "Password must be at least 6 characters";
    // }

    setInputError(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateForm()) {
        return;
      }
     const isUserLogedIn = await auth.loginAction(userCred)

      // Navigate to dashboard
      if(isUserLogedIn){
        navigate("/dashboard");
      }else{
        setErrorMessage("Invalid credentials");
      }
    } catch (error) {
      // Handle API error
      setErrorMessage(error.message || "Login failed");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">Login</h3>
        {errorMessage && (
          <p className="text-danger text-center">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <InputField
              labelName={"Email"}
              inputType={"email"}
              inputId={"email"}
              inputName={"email"}
              placeholder={"Enter Your valid email"}
              values={userCred.email}
              isInvalid={!!inputError.email}
              invalidError={inputError.email}
              inputHandleChange={handleChange}
            />
            <InputField
              labelName={"Password"}
              inputType={"password"}
              inputId={"password"}
              inputName={"password"}
              placeholder={"Enter Your valid password"}
              labelStyle={"mt-3"}
              values={userCred.password}
              inputHandleChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="mb-0">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
