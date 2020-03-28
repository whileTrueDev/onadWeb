const HOST = process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_API_HOSTNAME : process.env.DEV_API_HOSTNAME;
export const REACT_HOST = process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_REACT_HOSTNAME : process.env.DEV_REACT_HOSTNAME;

export default HOST;
