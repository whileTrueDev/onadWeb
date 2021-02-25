import { Handlers } from '../interfaces/handler.interface';

// Called when client reconnected
const onReconnectHandler: Handlers['onReconnectHandler'] = (): void => {
  console.log(`[${new Date().toLocaleString()}] client reconnected`);
};

export default onReconnectHandler;
