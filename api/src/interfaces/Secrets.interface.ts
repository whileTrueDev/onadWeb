export interface DbSecret {
  password: string;
  engine: 'mysql' | 'mariadb';
  port: number;
  host: string;
  username: string;
  dbname: string;
}
