const tmi = require('tmi.js');
const now = require('../utils/now');
const doQuery = require('../lib/doQuery');

// configure constants
const BOT_NAME = 'OnADy';
const BOT_OAUTH_TOKEN = 'oauth:ql78nrmxylz561jfwizzu7vi973vld';

const tmiClientOption = {
  debug: false,
  connection: { reconnect: true, secure: true },
  identity: {
    username: BOT_NAME,
    password: BOT_OAUTH_TOKEN
  },
  channels: []
};

/**
 * 온애드 트위치 채팅 수집기
 */
function TwitchChatCollector(COLLECT_UNIT_SIZE) {
  this.COLLECT_UNIT_SIZE = COLLECT_UNIT_SIZE;
  this.clients = [];

  /**
   * @description 온애드의 트위치 채팅로그 수집 클라이언트 생성함수
   * @param {list} channels 해당 클라이언트가 수집할 채널의 목록(creatorTwitchId)
   */
  function createClient(channels) {
    // Override `channels` property
    tmiClientOption.channels = channels;

    // Create tmi client and connect to Twitch
    const client = new tmi.Client(tmiClientOption);

    // tmi client configurations
    client.clientId = `onadClient${this.clients.length}`;
    client.chats = [];
    client.status = 'connected';
    client.COLLECT_UNIT_SIZE = this.COLLECT_UNIT_SIZE;
    client.connect();
    this.clients.push(client);
    console.log(`ChatCollector Client ON - [${client.clientId}]`);


    // Called every time a message comes in
    function onMessageHandler(target, context, msg, self) {
      if (self) { return; } // Ignore messages from the bot

      const data = {
        creatorId: context['room-id'],
        time: now(),
        name: context['display-name'],
        userid: context['user-id'],
        subscriber: context.subscriber,
        manager: context.mod,
        badges: context.badges,
        text: msg
      };

      // 채팅로그 보기
      // const log = `[${client.clientId}] ${client.chats.length}
      // - <${data.creatorId}> ${data.text}`;
      // console.log(log);

      // 데이터를 지속적으로 메모리에 쌓는다.
      client.chats.push(data);

      // 채팅 로그가 특정 시간 or 특정 개수 이상이 되면 DB에 적재한다.
      if (client.chats.length >= client.COLLECT_UNIT_SIZE) {
        console.log(`${client.COLLECT_UNIT_SIZE}개의 채팅 데이터가 메모리 상에 쌓였습니다.`);

        // DB에 적재
        // Queries
        const query = `
        INSERT INTO twitchChat
        ( creatorId, time, name, userId, subscriber, manager, badges, text  )
        VALUES`;
        let queryValues = '';
        let queryArray = [];

        client.chats.map((chat, index) => {
          const values = '(?, ?, ?, ?, ?, ?, ?, ?)';
          const comma = ',\n';

          if (index !== client.chats.length - 1) {
            queryValues += values + comma;
          } else {
            queryValues += values;
          }

          queryArray = queryArray.concat([
            chat.creatorId, chat.time, chat.name, chat.userid,
            chat.subscriber ? 1 : 0, chat.manager ? 1 : 0,
            chat.badges ? JSON.stringify(chat.badges) : null, chat.text
          ]);

          return null;
        });

        // Reqeust query to DB
        doQuery(query + queryValues, queryArray).then((row) => {
          if (!row.error && row.result) {
            console.log('done');
          } else {
            console.log('err');
          }
        }).catch((err) => {
          console.log('err', err);
        });

        // 데이터 삭제하여 메모리 공간 확보
        client.chats = [];
      }

    /** *************************************
     * 챗봇의 영역.
     * 메시지 중, 특정 단어의 경우 대답하도록 한다.
     * 크리에이터의 oauth 권한 허용이 필요하다.
     **************************************** */
    // Remove whitespace from chat message
    // const commandName = msg.trim();
    // if (commandName === '!dice') {
    //   const num = rollDice();
    //   client.say(target, `You rolled a ${num}`);
    // }
    }

    // Called every time connected with chat room
    function onConnectedHandler(addr, port) {
      console.log(`* Connected to ${addr}:${port}`);
    }

    // Set handlers
    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);

    return client;
  }

  function disconnect(clientId) {
    // 클라이언트를 disconnect
    console.log(clientId);
  }

  function getStatus() {
    // 현재 작동중인 클라이언트를 조회
    const runningClient = [];
    const stoppedClient = []; // 꺼진 클라이언트
    this.clients.forEach((client) => {
      if (client.status === 'connected') {
        runningClient.push({
          clientId: client.clientId,
          channels: client.channels
        });
      } else {
        stoppedClient.push({
          clientId: client.clientId,
          channels: client.channels
        });
      }
    });
    console.log(runningClient);
    console.log(stoppedClient);
  }

  function firstStart() {
    const CONTRACTED_STATE = 1; // 온애드와 계약된 크리에이터 상태값
    const query = `
    SELECT creatorTwitchId
    FROM creatorInfo
    WHERE creatorContractionAgreement = ?
    `;
    const queryArray = [CONTRACTED_STATE];

    const allChannels = [];
    return doQuery(query, queryArray)
      .then((row) => {
        if (!row.error && row.result) {
          row.result.map((creator) => {
            allChannels.push(creator.creatorTwitchId);
            return null;
          });

          // 한 클라이언트에 들어갈 크기만큼 잘라서 여러개의 클라이언트 생성.
          this.createClient(allChannels);
          console.log(Math.round(process.memoryUsage().heapUsed / 1024 / 1024));
        }
      }).catch((err) => {
        console.log('ERROR in getContractedCreator:', err);
      });
  }

  this.createClient = createClient;
  this.disconnect = disconnect;
  this.getStatus = getStatus;
  this.firstStart = firstStart;
}


module.exports = TwitchChatCollector;
