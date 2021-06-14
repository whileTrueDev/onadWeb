import { ConnectionOptions } from 'typeorm';
import { DbSecret } from '../interfaces/Secrets.interface';

const database: DbSecret = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  engine: 'mariadb',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbname: process.env.DB_DATABASE,
};

const ormconfig: ConnectionOptions = {
  type: 'mariadb',
  host: database.host,
  port: database.port,
  username: database.username,
  password: database.password,
  database: database.dbname,
  charset: process.env.DB_CHARSET || 'utf8mb4',
  timezone: 'Asia/Seoul',
  synchronize: false,
  entities: ['dist/entities/*.{ts,js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
  migrationsTableName: 'onadMigrations',
  cli: { migrationsDir: `src/migrations` },
  logging: process.env.NODE_ENV === 'production' ? ['migration', 'error'] : 'all',
};

export default ormconfig;
