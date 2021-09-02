import axios from 'axios';
import host from '../config';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: host,
});

export default axiosInstance;
