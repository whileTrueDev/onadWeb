import dotenv from 'dotenv';
import ChatBot, { ChatBotOptions } from './chat/twitch/botV2';

dotenv.config();

async function main(): Promise<void> {
  const { SOCKET_HOSTNAME } = process.env;

  // onadbot - V2 by hwasurr 21.02.23
  // 트위치 로그인 아이디 - onadbot
  // 비밀번호는 온애드에서 자주 쓰는 것
  const BOT_NAME = 'onadbot';
  const BOT_OAUTH_TOKEN = process.env.TWITCH_BOT_OAUTH_TOKEN;
  const OPTION: ChatBotOptions = {
    connection: { reconnect: true, secure: true },
    identity: { username: BOT_NAME, password: BOT_OAUTH_TOKEN },
    SOCKET_HOSTNAME: SOCKET_HOSTNAME as string,
  };
  const twitchChatbot = new ChatBot(OPTION);
  await twitchChatbot.connect();

  // 챗봇 스케쥴러 ON
  twitchChatbot.runSchedulers();
}

main()
  .then(() => console.log('Chatbot Successfully started'))
  .catch((err) => {
    throw new Error(err);
  });
