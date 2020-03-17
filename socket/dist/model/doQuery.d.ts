import { QueryResult } from '../@types/db';
declare const doQuery: (query: string, queryArray?: any[] | undefined) => Promise<QueryResult>;
export default doQuery;
