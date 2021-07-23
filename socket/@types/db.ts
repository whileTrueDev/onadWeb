import { MysqlError } from 'mysql';

// type정의 for Query Result
export interface QueryResult {
  error?: MysqlError | null;
  result: any;
}

