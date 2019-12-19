const tmi = require('tmi.js'); // For twitchChat socket server
const schedule = require('node-schedule'); // Set schedule for insert data
const doQuery = require('../lib/doQuery');
const createChatInsertQueryValues = require('../lib/createChatInsertQueryValues');

// configure constants
const BOT_NAME = 'OnADy';
const BOT_OAUTH_TOKEN = 'oauth:ql78nrmxylz561jfwizzu7vi973vld';
const CLIENT_CONNECTED_STATE = 'connected';
const CLIENT_STOPPED_STATE = 'stopped';

/**
 * 온애드 트위치 채팅 수집기
 */

function TwitchChatCollectorV2() {
  const OPTION = {
    debug: false,
    connection: { reconnect: true, secure: true },
    identity: {
      username: BOT_NAME,
      password: BOT_OAUTH_TOKEN
    },
    channels: ['jaehwan3471', 'newthingtv']
  };

  // Called every time connected with chat room
  function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }

  function onMessageHandler(target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    const data = {
      creatorId: context['room-id'],
      time: new Date(),
      name: context['display-name'],
      userid: context['user-id'],
      subscriber: context.subscriber,
      manager: context.mod,
      badges: context.badges,
      text: msg
    };

    console.log(data);
  }

  const client = new tmi.Client(OPTION);
  client.on('message', onMessageHandler);
  client.on('connected', onConnectedHandler);
  // client.on('disconnected', onDisconnectedHandler);
}


module.exports = TwitchChatCollectorV2;
