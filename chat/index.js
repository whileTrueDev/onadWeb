require('dotenv').config();
const tmi = require('tmi.js');
const now = require('./lib/now');
const doQuery = require('./lib/doQuery');

// configure constants
const BOT_NAME = 'ADy';
const BOT_OAUTH_TOKEN = 'oauth:ql78nrmxylz561jfwizzu7vi973vld';
const CHANNEL_NAME = 'jinsooo0';

// Create a client with our options
const client = new tmi.Client({
  debug: true,
  connection: { reconnect: true, secure: true },
  identity: {
    username: BOT_NAME,
    password: BOT_OAUTH_TOKEN
  },
  channels: [CHANNEL_NAME]
});
client.connect(); // Connect to Twitch:

// Define Chat data list
let chat = [];
// Constants
const COLLECT_UNIT_SIZE = 100;
// Queries
const query = `
INSERT INTO twitchChat
( creatorId, time, name, id, subscriber, manager, badges, text  )
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;
const queryArray = [];

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot


  const data = {
    creatorId: context['room-id'],
    time: now(),
    name: context['display-name'],
    id: context.username,
    subscriber: context.subscriber,
    manager: context.mod,
    badges: context.badges,
    text: msg
  };

  console.log(data);

  // 데이터를 지속적으로 메모리에 쌓는다.
  chat.push(data);
  console.log(`현재 데이터 개수: ${chat.length}`);

  // 채팅 로그가 특정 시간 or 특정 개수 이상이 되면 DB에 적재한다.

  if (chat.length >= COLLECT_UNIT_SIZE) {
    console.log(`${COLLECT_UNIT_SIZE}개의 채팅 데이터가 메모리 상에 쌓였습니다.`);

    // DB에 적재
    doQuery().then().catch();

    // 데이터 삭제하여 메모리 공간 확보
    chat = [];
  }

  //

  /** *************************************
   * 챗봇의 영역.
   * 메시지 중, 특정 단어의 경우 대답하도록 한다.
   * 크리에이터의 oauth 권한 허용이 필요하다.
   **************************************** */
  // Remove whitespace from chat message

  // const commandName = msg.trim();

  // If the command is known, let's execute it
  // if (commandName === '!dice') {
  //   const num = rollDice();
  //   client.say(target, `You rolled a ${num}`);
  //   console.log(`* Executed ${commandName} command`);
  // }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
