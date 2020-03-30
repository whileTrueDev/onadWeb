const HOST = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PRODUCTION_API_HOSTNAME : process.env.REACT_APP_DEV_API_HOSTNAME;
export const REACT_HOST = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PRODUCTION_REACT_HOSTNAME : process.env.REACT_APP_DEV_REACT_HOSTNAME;

export default HOST;
