import React, { createContext, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";

import { postRequest } from "../components/Axios/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const ifUserAvailable = localStorage.getItem("user");
    return ifUserAvailable ? JSON.parse(ifUserAvailable) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //   const navigate = useNavigate()

  const loginAction = async (userCred) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postRequest("auth/user/login", userCred);

      if (response.status === 200) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("role", response.data.userRole); // Save email
        return true;
      }
      return false;
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    setUser(null);
    localStorage.clear();
    // navigate("/")
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
