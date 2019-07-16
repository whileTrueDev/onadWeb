import axios from 'axios';

const customAxiosSetting = axios.create({
  withCredentials: true,
});

export default customAxiosSetting;
