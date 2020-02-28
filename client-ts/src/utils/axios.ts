import axios from 'axios';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;
const axiosInstance = axios.create({
  withCredentials: true,
});

export default axiosInstance;
