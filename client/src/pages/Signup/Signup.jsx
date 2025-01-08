import React, { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import InputField from "../../components/Shared/inputField";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted", formData);
      setSuccessMessage("Signup successful!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  };

  return (
    <Container
      className="mt-5 p-4 border rounded shadow"
      style={{ width: "30%", backgroundColor: "#f8f9fa" }}
    >
      <h2 className="text-center mb-4">Sign Up</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <InputField
          labelName={"Name"}
          labelStyle={"mb-3"}
          inputType={"text"}
          inputId={"name"}
          inputName={"name"}
          placeholder={"Enter your name"}
          values={formData.name}
          inputHandleChange={handleChange}
          isInvalid={!!errors.name}
          invalidError={errors.name}
        />

        <InputField
          labelName={"Email"}
          labelStyle={"mb-3"}
          inputType={"email"}
          inputId={"email"}
          inputName={"email"}
          placeholder={"Enter your email"}
          values={formData.email}
          inputHandleChange={handleChange}
          isInvalid={!!errors.email}
          invalidError={errors.email}
        />

        <InputField
          labelName={"Password"}
          labelStyle={"mb-3"}
          inputType={"password"}
          inputId={"password"}
          inputName={"password"}
          placeholder={"Enter your password"}
          values={formData.password}
          inputHandleChange={handleChange}
          isInvalid={!!errors.password}
          invalidError={errors.password}
        />

        <InputField
          labelName={"Confirm Password"}
          labelStyle={"mb-3"}
          inputType={"password"}
          inputId={"confirmPassword"}
          inputName={"confirmPassword"}
          placeholder={"Confirm your password"}
          values={formData.confirmPassword}
          inputHandleChange={handleChange}
          isInvalid={!!errors.confirmPassword}
          invalidError={errors.confirmPassword}
        />

        <Button variant="primary" type="submit" className="w-100">
          Sign Up
        </Button>
      </Form>
      <p className="text-center mt-3">
        Already have an account? <Link to="/">Log In</Link>
      </p>
    </Container>
  );
};

export default Signup;
