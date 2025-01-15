import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // const accessToken = localStorage.getItem('accessToken');
    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // const originalRequest = error.config;
    
    // if (error.response.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
      
    //   try {
    //     const refreshToken = localStorage.getItem('refreshToken');
    //     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh-token`, {
    //       refreshToken
    //     });
        
    //     const { accessToken } = response.data;
    //     localStorage.setItem('accessToken', accessToken);
        
    //     originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    //     return axiosInstance(originalRequest);
    //   } catch (refreshError) {
    //     localStorage.clear();
    //     window.location.href = "/login";
    //     return Promise.reject(refreshError);
    //   }
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
