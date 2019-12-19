const tmi = require('tmi.js'); // For twitchChat socket server
const connectDB = require('./connectDB');

// configure constants
const BOT_NAME = 'OnADyy';
// const BOT_OAUTH_TOKEN = 'oauth:o6x02nuufgjlsv28bywzygfid5uzbu'; // hwasurr
const BOT_OAUTH_TOKEN = 'oauth:nfn5l1uaylsq9q681ngx8dg6yxicwe'; // onadyy

/**
 * 온애드 트위치 채팅 수집기 v2
 */
class TwitchChatCollectorV2 {
  constructor() { // 인스턴스 속성 정의
    this.chatContainer = {
      channel_count: 0,
      channels: [],
      chat_count: 0,
      chats: [
        // ... chats
      ],
    };

    this.handlers = {
      // Called every time connected with chat room
      onConnectedHandler: (addr, port) => {
        console.log(`* Connected to ${addr}:${port}`);
      },

      // Called when Message is accepted
      onMessageHandler: (target, context, msg, self) => {
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

        // Insert to chatContainer
        this.chatContainer.chat_count += 1;
        this.chatContainer.chats.push(data);
      },
      // Called when ...
    };

    this.dbConnect = {
      //
    };
  }

  run() {
    connectDB.getContratedCreators()
      .then((creators) => {
        this.chatContainer.channels = creators.map(creator => creator.creatorTwitchId);
        const OPTION = {
          debug: true,
          connection: { reconnect: true, secure: true },
          identity: {
            username: BOT_NAME,
            password: BOT_OAUTH_TOKEN
          },
          channels: this.chatContainer.channels
        };

        const client = new tmi.Client(OPTION);

        client.on('connected', this.handlers.onConnectedHandler);
        client.on('message', this.handlers.onMessageHandler);

        setTimeout(() => {
          console.log('channel_count: ', client.channels.length);
          console.log('chat_count: ', this.chatContainer.chat_count);
          console.log('chats.length: ', this.chatContainer.chats.length);
        }, 30000);

        setTimeout(() => {
          console.log('channel_count: ', client.channels.length);
          console.log('chat_count: ', this.chatContainer.chat_count);
          console.log('chats.length: ', this.chatContainer.chats.length);
        }, 60000);

        setTimeout(() => {
          console.log('channel_count: ', client.channels.length);
          console.log('chat_count: ', this.chatContainer.chat_count);
          console.log('chats.length: ', this.chatContainer.chats.length);
        }, 90000);

        setTimeout(() => {
          console.log('channel_count: ', client.channels.length);
          console.log('chat_count: ', this.chatContainer.chat_count);
          console.log('chats.length: ', this.chatContainer.chats.length);
        }, 120000);
        client.connect();
      });
  }
}

module.exports = TwitchChatCollectorV2;
