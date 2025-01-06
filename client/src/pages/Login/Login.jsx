import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { postRequest } from "../../components/Axios/api"; // Import API functions

import InputField from "../../components/Shared/InputField";

const Login = () => {
  const [userCred, setUserCred] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCred((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the login API
      const response = await postRequest("auth/user/login", userCred);

      // console.log("user Login details", response.data);

      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("role", response.data.userRole); // Save email

      // Navigate to dashboard
      navigate("/dashboard");
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
              placholder={"Enter Your valid email"}
              values={userCred.email}
              inputHandleChange={handleChange}
            />
            <InputField
              labelName={"Password"}
              inputType={"password"}
              inputId={"password"}
              inputName={"password"}
              placholder={"Enter Your valid password"}
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
