import tmi, { ChatUserstate } from 'tmi.js'; // For twitchChat socket server
import connectDB from './connectDB';
import OnAdScheduler from './scheduler';
import { Chat } from './chat.d';

// configure constants
const BOT_NAME = 'onadyy';
// const BOT_OAUTH_TOKEN = 'oauth:o6x02nuufgjlsv28bywzygfid5uzbu'; // hwasurr
const BOT_OAUTH_TOKEN = 'oauth:nfn5l1uaylsq9q681ngx8dg6yxicwe'; // onadyy
const JOIN_TIMEOUT = 8000;

interface ChatContainer {
   chatCount: number;
   insertedChatCount: number;
   chatBuffer: Array<Chat>;
 }

interface OnADCollectorHandlers {
  onConnectedHandler(address: string, port: number): void;
  onMessageHandler(channel: string, userstate: ChatUserstate, message: string, self: boolean): void;
  onDisconnectedHandler(reason: string): void;
  onJoinHandler(channel: string, username: string, self: boolean): void;
  onReconnectHandler(): void;
  onTimeoutHandler(channel: string, username: string, reason: string, duration: number): void;
  onPingHandler(): void;
  onPongHandler(latency: number): void;
}
/**
 * 온애드 트위치 채팅 수집기 v2
 */
class TwitchChatCollectorV2 {
  client: tmi.Client | null;
  private runningSchedulers: Array<OnAdScheduler>;
  private joinedChannels: Array<string>;
  private chatContainer: ChatContainer;
  private handlers: OnADCollectorHandlers;

  constructor() { // 인스턴스 속성 정의
    this.client = null;
    this.runningSchedulers = [];
    this.joinedChannels = []; // join 채널
    this.chatContainer = {
      chatCount: 0,
      chatBuffer: [
        // ... chats
      ],
      insertedChatCount: 0,
    };
    this.handlers = {
      // Called every time connected with chat room
      onConnectedHandler: (addr, port): void => {
        console.log(`* Connected to ${addr}:${port}`);
      },
      // Called when Message is accepted
      onMessageHandler: (channel, userstate, msg, self): void => {
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

        // 광고채팅봇 동의는 10분마다 갱신하여 this의 멤버로 추가 ( 스케쥴러 이용 )
        // 광고채팅봇 동의된 크리에이터 목록을 통해 해당 크리에이터채널이 동의하였는지 확인 이후 진행
        // 함수로 생성하여 사용.
        if (msg.startsWith('!say')) {
          if (this.client) {
            this.client.say(channel, '안녕하세요 온애드입니다 블라블라').then((res) => {
              console.log(res);
            }).catch((err) => { console.log(err); });
          }
        }

        // Insert to chatContainer
        this.chatContainer.chatCount += 1;
        this.chatContainer.chatBuffer.push(data);
      },
      // Called when client disconnected
      onDisconnectedHandler: (reason): void => {
        console.log(`Client Disconnected.. ${reason}`);
      },
      // Called when client join channel
      onJoinHandler: (channel, username, self): void => {
        if (self) { // join event from the onad bot
          const channelName = channel.replace('#', '');
          console.log(`[${new Date().toLocaleString()}] join channel: ${channelName}`);
          this.joinedChannels.push(channelName);
        }
      },
      // Called when client reconnected
      onReconnectHandler: (): void => {
        console.log(`[${new Date().toLocaleString()}] client reconnected`);
      },
      // Called when channel timeout
      onTimeoutHandler: (channel, username, reason, duration): void => {
        console.log(`timeout: ${channel}, ${reason}, ${duration}`);
      },
      onPingHandler: (): void => {
        console.log('pingcheck');
      },
      onPongHandler: (latency): void => {
        console.log(`pong ${latency}`);
      },
    };

    connectDB.getContratedCreators()
      .then((creators) => {
        const contractedChannels = creators.map((creator) => creator.creatorTwitchId);
        console.log(`contractedChannels : ${contractedChannels.length}`);
        const OPTION = {
          debug: true,
          connection: { reconnect: true, secure: true },
          identity: { username: BOT_NAME, password: BOT_OAUTH_TOKEN },
          // channels: contractedChannels
          // test
          channels: ['iamsupermazinga', 'dkdkqwer', 'oxquizzz', 'kevin20222']
        };

        const client = tmi.Client(OPTION);
        this.client = client;
        if (this.client) {
          this.client.on('connected', this.handlers.onConnectedHandler);
          this.client.on('join', this.handlers.onJoinHandler);
          this.client.on('message', this.handlers.onMessageHandler);
          this.client.on('disconnected', this.handlers.onDisconnectedHandler);
          this.client.on('reconnect', this.handlers.onReconnectHandler);
          this.client.on('ping', this.handlers.onPingHandler);
          this.client.on('timeout', this.handlers.onTimeoutHandler);
          this.client.connect();
        }
      });
  }

  healthCheck(): void { // 로깅 및 헬스체크 - 1 or 5분 단위
    console.log('=================== healthCheck ====================');
    console.log('[TIME]: ', new Date().toLocaleString());
    console.log(`[Collecting channels]: ${this.joinedChannels.length}`);
    console.log('[All chats on client]: ', this.chatContainer.chatCount);
    console.log('[Chats on collector buffer]: ', this.chatContainer.chatBuffer.length);
    console.log(`[Chats inserted]: ${this.chatContainer.insertedChatCount}`);
    console.log(`[Running Schedulers]: ${this.runningSchedulers.length}`);
  }

  addNewCreator(): void { // 새로운/정지된 크리에이터 채널에 입장 - 매일 0시 1분.
    console.log('=============== AddNewCreator ===============');
    connectDB.getContratedCreators()
      .then((allCreator) => {
        // 새로운 크리에이터 채널 입장
        let newCreators = allCreator.map((creator) => creator.creatorTwitchId);
        newCreators = newCreators.filter(
          (creator) => !(this.joinedChannels.includes(creator))
        );

        newCreators.forEach((creator, idx) => {
          const anonFunc = (creator1: string): void => {
            setTimeout(() => {
              if (this.client) {
                this.client.join(creator1)
                  .catch((err) => { console.log(`channel join error: ${err}`); });
              }
            }, idx * JOIN_TIMEOUT);
          };
          anonFunc(creator);
        });
      })
      .catch((err) => {
        console.log(`[Error] ${err}`);
      });
  }

  chatPeriodicInsert(): void { // 주기적 채팅로그 삽입 - 매 10분
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


  runScheduler(): void {
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
    this.runScheduler();
  }
}

export default TwitchChatCollectorV2;
