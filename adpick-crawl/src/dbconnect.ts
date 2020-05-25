import { createConnection, Connection } from 'typeorm';
import ormconfig from './config/ormconfig';

async function connect(): Promise<Connection> {
  // createConnection method will automatically read connection options
  // from your ormconfig file or environment variables
  const connection = await createConnection(ormconfig);
  // typeorm은 기본적으로 connection pool을 사용.( 10개의 커넥션 )
  return connection;
}


export default connect;
