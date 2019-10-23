import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.CancelToken = axios.CancelToken;
axiosInstance.isCancel = axios.isCancel;

export default axiosInstance;
