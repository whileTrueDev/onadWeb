import { MysqlError } from 'mysql';
export interface QueryResult {
    error?: MysqlError | null;
    result: any;
}
