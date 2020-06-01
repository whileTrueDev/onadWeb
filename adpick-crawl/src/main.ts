import dotenv from 'dotenv';
import Adpick from './lib/adpick';
import dbconnect from './dbconnect';

dotenv.config();

const SUCCESS_CODE = 0;
const ERROR_CODE = 1;

async function main(): Promise<number> {
  // *************************************************
  // Initialization
  const connection = await dbconnect();

  // *************************************************
  // Logics

  // Initialization
  const adpick = new Adpick();
  // Getting data from adpick
  const data = await adpick.getData();
  // Insert data
  await adpick.insertData(connection, data);

  return SUCCESS_CODE;
}

main()
  .then((c) => process.exit(c))
  .catch((err) => { console.log(err); return process.exit(ERROR_CODE); });
