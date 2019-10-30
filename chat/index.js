const tmi = require('tmi.js');

const BOT_USERNAME = 'adbot';
const OAUTH_TOKEN = 'oauth:ql78nrmxylz561jfwizzu7vi973vld';
const CHANNEL_NAME = 'iamsupermazinga';
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

// Function called when the "dice" command is issued
function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Date Fuction called when the message comes in
function now() {
  const thisTime = new Date();
  return thisTime.toLocaleString();
}

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  console.log(context);
  console.log(`${target} [${now()}] <${context['display-name']}> ${msg}`);

  // Remove whitespace from chat message
  const commandName = msg.trim();
  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
