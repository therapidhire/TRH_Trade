import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json", // Ensure JSON data
    },
  });
  

// Generic function for GET request
export const getRequest = async (url, params = {}) => {
  try {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Generic function for POST request
export const postRequest = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Generic function for PUT request
export const putRequest = async (url, data) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Generic function for DELETE request
export const deleteRequest = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
