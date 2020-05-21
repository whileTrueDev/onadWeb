import dotenv from 'dotenv';

dotenv.config();

const HOST = process.env.REACT_APP_API_HOSTNAME;
export const REACT_HOST = process.env.REACT_APP_REACT_HOSTNAME;

export default HOST;
