import { ConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const config: ConnectionOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: 'utf8mb4',
  synchronize: true,
  logging: true,
  entities: [
    'src/entity/*.ts', 'modules/**/entity/*.ts',
    'src/entity/*.js', 'modules/**/entity/*.js',
    'entity/*.js',
  ],
};

export default config;
