const tmi = require('tmi.js'); // For twitchChat socket server
const connectDB = require('./connectDB');
const OnAdScheduler = require('./scheduler');
// configure constants
const BOT_NAME = 'onadyy';
// const BOT_OAUTH_TOKEN = 'oauth:o6x02nuufgjlsv28bywzygfid5uzbu'; // hwasurr
const BOT_OAUTH_TOKEN = 'oauth:nfn5l1uaylsq9q681ngx8dg6yxicwe'; // onadyy
const JOIN_TIMEOUT = 8000;
/**
 * 온애드 트위치 채팅 수집기 v2
 * @description 트위치 제한 :  20 commands per 30 seconds for normal accounts
 */
class TwitchChatCollectorV2 {
  constructor() { // 인스턴스 속성 정의
    this.joinedChannels = []; // join 채널
    this.stoppedChannels = []; // timeout된 채널
    this.chatContainer = {
      chatCount: 0,
      chatBuffer: [
        // ... chats
      ],
      insertedChatCount: 0,
    };

    this.handlers = {
      // Called every time connected with chat room
      onConnectedHandler: (addr, port) => {
        console.log(`* Connected to ${addr}:${port}`);
      },
      // Called when Message is accepted
      onMessageHandler: (channel, userstate, msg, self) => {
        if (self) { return; } // Ignore messages from the bot

        const data = {
          creatorId: userstate['room-id'],
          time: new Date(),
          name: userstate['display-name'],
          userid: userstate['user-id'],
          subscriber: userstate.subscriber,
          manager: userstate.mod,
          badges: userstate.badges,
          text: msg
        };

        // Insert to chatContainer
        this.chatContainer.chatCount += 1;
        this.chatContainer.chatBuffer.push(data);
      },
      // Called when client disconnected
      onDisconnectedHandler: (reason) => {
        console.log(`Client Disconnected.. ${reason}`);
      },
      // Called when client join on channel
      onJoinHandler: (channel, username, self) => {
        if (self) { // join event from the onad bot
          const channelName = channel.replace('#', '');
          console.log(`[${new Date().toLocaleString()}] join on channel: ${channelName}`);
          this.joinedChannels.push(channelName);
        }
      },
      // Called when client reconnected
      onReconnectHandler: () => {
        console.log(`[${new Date().toLocaleString()}] client reconnected`);
      },
      // Called when channel timeout
      onTimeoutHandler: (channel, username, reason, duration) => {
        console.log(channel, reason, duration);
        const idx = this.joinedChannels.indexOf(channel);
        this.joinedChannels.splice([idx], 1); // joinedChannel에서 제외
        this.stoppedChannels.push(channel); // stoppedChannel에 추가
      },
      onPingHandler: () => {
        console.log('pingcheck');
      },
      onPongHandler: (latency) => {
        console.log(`pong ${latency}`);
      },
    };
  }

  healthCheck() { // 로깅 및 헬스체크 - 1 or 5분 단위
    console.log('=================== healthCheck ====================');
    console.log('[TIME]: ', new Date().toLocaleString());
    console.log(`[Collecting channels]: ${this.joinedChannels.length}`);
    console.log(`[Stopped channels]: ${this.stoppedChannels.length}`);
    console.log('[All chats on client]: ', this.chatContainer.chatCount);
    console.log('[Chats on collector buffer]: ', this.chatContainer.chatBuffer.length);
    console.log(`[Chats inserted]: ${this.chatContainer.insertedChatCount}`);
    console.log(`[Running Schedulers]: ${this.runningSchedulers.length}`);
  }

  addNewCreator() { // 새로운/정지된 크리에이터 채널에 입장 - 매일 0시 1분.
    console.log('=============== AddNewCreator ===============');
    connectDB.getContratedCreators()
      .then((creators) => {
        // 새로운 크리에이터 채널 입장
        let newCreators = creators.map(creator => creator.creatorTwitchId);
        newCreators = newCreators.filter(
          creator => !this.joinedChannels.includes(creator)
        );

        newCreators.forEach((creator, idx) => {
          const anonFunc = (creator1) => {
            setTimeout(() => {
              this.client.join(creator1)
                .catch((err) => {
                  console.log(`channel join error: ${err}`);
                });
            }, idx * JOIN_TIMEOUT);
          };
          anonFunc(creator);
        });
      })
      .catch((err) => {
        console.log(`[Error] ${err}`);
      });
  }

  chatPeriodicInsert() { // 주기적 채팅로그 삽입 - 매 10분
    const { chatBuffer } = this.chatContainer;
    console.log('=================== Chat-autoInsert ====================');
    console.log('[TIME]: ', new Date().toLocaleString());
    console.log(`[Request Insert Rows]: ${chatBuffer.length} chats`);

    if (chatBuffer.length > 0) {
      connectDB.insertChats(chatBuffer)
        .then((result) => {
          // result = db OKPacket
          this.chatContainer.insertedChatCount += result.affectedRows;
          console.log(`[Successfully Inserted Rows]: ${result.affectedRows} chats`);
          // cleanup chatBuffer
          this.chatContainer.chatBuffer = [];
        })
        .catch((err) => {
          console.log(`[DB error]: ${err}`);
        });
    } else {
      console.log('[Skip!..]: 채팅데이터없음');
    }
  }

  runClient() {
    connectDB.getContratedCreators()
      .then((creators) => {
        const contractedChannels = creators.map(creator => creator.creatorTwitchId);
        console.log(`contractedChannels : ${contractedChannels.length}`);
        const OPTION = {
          debug: true,
          connection: { reconnect: true, secure: true },
          identity: {
            username: BOT_NAME,
            password: BOT_OAUTH_TOKEN
          },
          channels: contractedChannels
          // // test
          // channels: ['iamsupermazinga']
        };

        const client = new tmi.Client(OPTION);
        this.client = client;
        this.client.on('connected', this.handlers.onConnectedHandler);
        this.client.on('join', this.handlers.onJoinHandler);
        this.client.on('message', this.handlers.onMessageHandler);
        this.client.on('disconnected', this.handlers.onDisconnectedHandler);
        this.client.on('reconnect', this.handlers.onReconnectHandler);
        this.client.on('ping', this.handlers.onPingHandler);
        this.client.on('timeout', this.handlers.onTimeoutHandler);
        this.client.connect();
      });
  }

  runScheduler() {
    console.log('start schdulejobs!');
    const healthCheckScheduler = new OnAdScheduler(
      'healthcheck', '* * * * *', this.healthCheck.bind(this)
    );
    const addNewCreatorScheduler = new OnAdScheduler(
      'addnewcreator', '1 0 * * *', this.addNewCreator.bind(this)
    );
    const chatPeriodicInsertScheduler = new OnAdScheduler(
      'auatoinsert', '*/10 * * * *', this.chatPeriodicInsert.bind(this)
    );

    this.runningSchedulers = [
      healthCheckScheduler,
      addNewCreatorScheduler,
      chatPeriodicInsertScheduler
    ];
  }

  run() {
    this.runClient();
    this.runScheduler();
  }
}

module.exports = TwitchChatCollectorV2;
