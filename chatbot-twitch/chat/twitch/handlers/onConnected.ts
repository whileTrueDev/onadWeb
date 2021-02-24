import { Handlers } from '../interfaces/handler.interface';

const onConnectedHandler: Handlers['onConnectedHandler'] = (
  addr, port
): void => {
  console.log(`* Connected to ${addr}:${port}`);
};

export default onConnectedHandler;
