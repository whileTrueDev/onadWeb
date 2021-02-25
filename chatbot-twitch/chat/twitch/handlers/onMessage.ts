import { Handlers } from '../interfaces/handler.interface';

const onMessageHandler: Handlers['onMessageHandler'] = (
  channel, userstate, msg, self
): void => {
  if (self) return;

  // 관리자 권한이 있는 경우에만 실행
  if (msg.toLowerCase() === '!onad stop' && userstate.mod) {
    // quit the chat room

    // disable onad chatbot agreement state

  }
};

export default onMessageHandler;
