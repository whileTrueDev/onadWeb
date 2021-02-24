import { Handlers } from '../interfaces/handler.interface';

// Called when client disconnected
const onDisconnectedHandler: Handlers['onDisconnectedHandler'] = (reason): void => {
  console.log(`Client Disconnected.. ${reason}`);
};

export default onDisconnectedHandler;
