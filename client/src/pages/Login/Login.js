import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
<<<<<<< HEAD
import { postRequest } from "../../utils/api"; // Import API functions

const Login = () => {
  const [credentials, setCredentials] = useState({ email: ""});
=======
import { postRequest } from "../../components/Axios/api"; // Import API functions

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
>>>>>>> 09a184939353169bffaadfb2a6670fe417392756
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the login API
      // const response = await postRequest("/user/login", credentials);
<<<<<<< HEAD
      const response = await postRequest("/users/user/login", credentials);

      // Save token or user details in local storage
      localStorage.setItem("userId", response.data.userId)
      localStorage.setItem("role", response.data.userRole); // Save email
=======
      const response = await postRequest("/users/login", credentials);

      // Save token or user details in local storage
      localStorage.setItem("token", response.data.token); // Assuming API returns a token
      localStorage.setItem("userId", response.data.userId)
      localStorage.setItem("role", response.data.roles); // Save email
>>>>>>> 09a184939353169bffaadfb2a6670fe417392756

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      // Handle API error
      setErrorMessage(error.message || "Login failed");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Login</h3>
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="form-control"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
<<<<<<< HEAD
          {/* <div className="mb-3">
=======
          <div className="mb-3">
>>>>>>> 09a184939353169bffaadfb2a6670fe417392756
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={credentials.password}
              onChange={handleChange}
              required
            />
<<<<<<< HEAD
          </div> */}
=======
          </div>
>>>>>>> 09a184939353169bffaadfb2a6670fe417392756
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
<<<<<<< HEAD
        {/* <div className="text-center mt-3">
=======
        <div className="text-center mt-3">
>>>>>>> 09a184939353169bffaadfb2a6670fe417392756
          <p className="mb-0">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary">
              Sign up
            </Link>
          </p>
<<<<<<< HEAD
        </div> */}
=======
        </div>
>>>>>>> 09a184939353169bffaadfb2a6670fe417392756
      </div>
    </div>
  );
};

export default Login;
