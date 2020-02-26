import mysql from 'mysql';

const port = typeof process.env.DB_PORT === 'string' ? Number(process.env.DB_PORT) : process.env.DB_PORT;

const dbconfig: mysql.ConnectionConfig = {
  host: process.env.DB_HOST,
  port,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: process.env.DB_CHARSET,
};

const pool = mysql.createPool(dbconfig);

export default pool;
