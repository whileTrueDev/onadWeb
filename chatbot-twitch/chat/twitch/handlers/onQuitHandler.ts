import { Handlers } from '../interfaces/handler.interface';

const onQuitHandler: Handlers['onQuitHandler'] = (channel: string, username: string, self: boolean): void => {
  if (self) {
    console.log('QUIT CHANNEL -', channel);
  }
};

export default onQuitHandler;
