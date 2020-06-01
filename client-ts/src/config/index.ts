import dotenv from 'dotenv';

dotenv.config();

const HOST = process.env.REACT_APP_API_HOSTNAME;
export const REACT_HOST = process.env.REACT_APP_REACT_HOSTNAME;
export const ADPAGE_HOST = process.env.REACT_APP_ADPAGE_HOST;

export default HOST;
