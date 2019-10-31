const tmi = require('tmi.js');

const BOT_USERNAME = 'adbot';
const OAUTH_TOKEN = 'oauth:ql78nrmxylz561jfwizzu7vi973vld';
const CHANNEL_NAME = 'silphtv';
const CHANNEL_NAME2 = 'dingception';

// Define configuration options
const opts = {
  debug: true,
  connections: { reconnect: true, secure: true },
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN
  },
  channels: [
    CHANNEL_NAME, CHANNEL_NAME2
  ]
};

// Data format


const client = new tmi.Client(opts); // Create a client with our options
client.connect(); // Connect to Twitch:

// Date Fuction called when the message comes in
function now() {
  const thisTime = new Date();
  return thisTime.toLocaleString();
}

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  const data = {
    channel: target.slice(1),
    time: now(),
    name: context['display-name'],
    id: context.username,
    subscriber: context.subscriber,
    badges: context.badges,
    manager: context.mod,
    text: msg
  };

  console.log(data);


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
