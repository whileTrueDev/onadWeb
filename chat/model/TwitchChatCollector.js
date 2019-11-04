const tmi = require('tmi.js');
const schedule = require('node-schedule');
const doQuery = require('../lib/doQuery');
const createChatInsertQueryValues = require('../lib/createChatInsertQueryValues');
// utils
const now = require('../utils/now');
const arrayDivide = require('../utils/arrayDivide');
// configure constants
const BOT_NAME = 'OnADy';
const BOT_OAUTH_TOKEN = 'oauth:ql78nrmxylz561jfwizzu7vi973vld';

/**
 * 온애드 트위치 채팅 수집기
 */
function TwitchChatCollector() {
  const LIMIT_CHANNEL_ON_CLIENT = 20;
  this.COLLECT_UNIT_SIZE = LIMIT_CHANNEL_ON_CLIENT * 5;
  this.clients = [];

  /**
   * @description 온애드의 트위치 채팅로그 수집 클라이언트 생성함수
   * @param {list} channels 해당 클라이언트가 수집할 채널의 목록(creatorTwitchId)
   */
  function createClient(channels) {
    // Override `channels` property
    const tmiClientOption = {
      debug: false,
      connection: { reconnect: true, secure: true },
      identity: {
        username: BOT_NAME,
        password: BOT_OAUTH_TOKEN
      },
      channels
    };

    // Create tmi client and connect to Twitch
    const client = new tmi.Client(tmiClientOption);

    // tmi client configurations
    client.clientId = `onadClient${this.clients.length + 1}`;
    client.numChats = 0;
    client.status = 'connected';
    client.COLLECT_UNIT_SIZE = this.COLLECT_UNIT_SIZE;
    client.chats = [];
    client.initalizeChats = () => { client.chats = []; };
    client.connect();
    this.clients.push(client);
    console.log('===================================================');
    console.log(`ChatCollector Client ON - [${client.clientId}]\n[channels]\n${channels}`);

    // Called every time a message comes in
    function onMessageHandler(target, context, msg, self) {
      client.numChats += 1;
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
      // const { clientId, chats } = client;
      // const { text } = data;
      // const log = `[${clientId}] ${chats.length} - <${target}> ${text}`;
      // console.log(log);

      // 데이터를 지속적으로 메모리에 쌓는다.
      client.chats.push(data);

      // 채팅 로그가 특정 시간 or 특정 개수 이상이 되면 DB에 적재한다.
      if (client.chats.length >= client.COLLECT_UNIT_SIZE) {
        const { clientId, COLLECT_UNIT_SIZE } = client;
        console.log(`[${now()}][${clientId}] - ${COLLECT_UNIT_SIZE} STORE REQUEST`);

        // DB에 적재
        // Queries
        const query = `
        INSERT INTO twitchChat
        ( creatorId, time, name, userId, subscriber, manager, badges, text )
        VALUES`;
        const [queryArray, queryValues] = createChatInsertQueryValues(client.chats);

        // Reqeust query to DB
        doQuery(query + queryValues, queryArray).then((row) => {
          if (!row.error && row.result) {
            console.log(`[${now()}][${clientId}] - [DB적재 성공] ${COLLECT_UNIT_SIZE} STORED`);
          } else {
            console.log(`[${now()}][${clientId}] - [DB적재 에러]`);
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

    function onDisconnectedHandler() {
      client.status = 'stopped';
    }

    // Set handlers
    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);
    client.on('disconnected', onDisconnectedHandler);

    return client;
  }

  // 현재 작동중인 클라이언트를 조회
  function getStatus() {
    const runningClient = []; const stoppedClient = [];
    let allChatsNum = 0; let allCHatsNumInBuffer = 0;
    let allRunningChannels = []; // 켜진 모든 채널
    let allStoppedChannels = []; // 꺼진 클라이언트
    this.clients.map((client) => {
      if (client.status === 'connected') {
        runningClient.push({
          clientId: client.clientId,
          channels: client.channels
        });
        allRunningChannels = allRunningChannels.concat(client.channels);
      } else {
        stoppedClient.push({
          clientId: client.clientId,
          channels: client.channels
        });
        allStoppedChannels = allStoppedChannels.concat(client.channels);
      }
      allChatsNum += client.numChats;
      allCHatsNumInBuffer += client.chats.length;
      return client;
    });

    this.status = {
      allChatsNum,
      allCHatsNumInBuffer,
      allRunningChannels,
      allStoppedChannels,
      running: runningClient,
      stopped: stoppedClient
    };
  }

  // 채팅로그 시작함수, creatorInfo에 따라.
  function start() {
    const CONTRACTED_STATE = 1; // 온애드와 계약된 크리에이터 상태값

    // 모든 계약된 크리에이터를 조회
    const query = `
      SELECT creatorTwitchId
      FROM creatorInfo
      WHERE creatorContractionAgreement = ?
      `;
    const queryArray = [CONTRACTED_STATE];
    doQuery(query, queryArray).then((row) => {
      const allChannels = [];
      if (!row.error && row.result) {
        row.result.map((creator) => {
          allChannels.push(`#${creator.creatorTwitchId}`);
          return null;
        });

        // 한 클라이언트에 들어갈 크기만큼 잘라서 여러개의 클라이언트 생성.
        const dividedChannels = arrayDivide(allChannels, LIMIT_CHANNEL_ON_CLIENT);
        dividedChannels.map((channels) => {
          this.createClient(channels);
          return channels;
        });
      }
    }).catch((err) => {
      console.log('ERROR in first START JOB:', err);
    });

    // 매일 실행하는 작업
    function dailyJob(twitchChatCollector) {
      const YESTERDAY = new Date();
      YESTERDAY.setDate(YESTERDAY.getDate() - 1);
      const YESTERDAY_STRING = `${YESTERDAY.getFullYear()}-${YESTERDAY.getMonth() + 1}-${YESTERDAY.getDate()}`;

      // 새로운(새로 계약한) 크리에이터가 있는지 확인
      const newCreatorSelectQuery = `
        SELECT creatorTwitchId
        FROM creatorInfo
        WHERE creatorContractionAgreement = ?
          AND date >= ?`;
      const newCreatorSelectArray = [CONTRACTED_STATE, YESTERDAY_STRING];
      doQuery(newCreatorSelectQuery, newCreatorSelectArray).then((row) => {
        let unConnectedChannels = [];

        // 꺼진 클라이언트 있는지 확인
        twitchChatCollector.getStatus();

        const { stopped } = twitchChatCollector.status;
        if (stopped.length > 0) {
          // connection 끊어진 클라이언트가 있는 경우
          stopped.map((client) => {
            unConnectedChannels.concat(client.channels);
            return null;
          });
        }

        if (!row.error && row.result) {
          // 새로운 크리에이터가 있는 경우
          row.result.map((result) => {
            unConnectedChannels.push(`#${result.creatorTwitchId}`);
            return null;
          });
        }

        // 새로운 클라이언트 생성 - 새로운 크리에이터, 꺼진 클라이언트의 채널들
        if (unConnectedChannels) {
          unConnectedChannels = unConnectedChannels.filter(
            val => !twitchChatCollector.status.allRunningChannels.includes(val)
          );
          console.log('새로운 클라이언트가 연결할 채널 : ', unConnectedChannels);
          if (unConnectedChannels.length > LIMIT_CHANNEL_ON_CLIENT) {
            const dividedChannels = arrayDivide(unConnectedChannels, LIMIT_CHANNEL_ON_CLIENT);
            dividedChannels.map((channels) => {
              twitchChatCollector.createClient(channels);
              return channels;
            });
          } else {
            twitchChatCollector.createClient(unConnectedChannels);
          }
        }
      });
    }

    // 매일 자정 작업
    schedule.scheduleJob('twitchChatScheduler', '1 0 * * *', () => {
      // 매일 0시 1분에 실행할 작업. ( 새로 계약한 크리에이터 및 꺼진 클라이언트의 크리에이터들을 모아 새로운 클라이언트 생성 )
      console.log('[TwitchCaht - dailyJob] ========= START =========');
      dailyJob(this);
    });

    // 매분 작업
    schedule.scheduleJob('healthCheck', '* * * * *', () => {
      this.getStatus();
      console.log('=================== healthCheck ====================');
      console.log('[TIME]: ', new Date().toLocaleString());
      console.log('[Running clients]: ', this.status.running.length);
      console.log('[Number of collecting channels]: ', this.status.allRunningChannels.length);
      console.log('[Collecting channels]: ', this.status.allRunningChannels.join(', '));
      console.log('[Stopped clients]: ', this.status.stopped.length);
      console.log('[Number of stopped channels]: ', this.status.allStoppedChannels.length);
      console.log('[Stopped channels]: ', this.status.allStoppedChannels.join(', '));
      console.log('[Chats on all clients]: ', this.status.allChatsNum);
      console.log('[Chats on onad collector buffer]: ', this.status.allCHatsNumInBuffer);
      console.log('================= healthCheck DONE ==================');
    });

    // 매 10분 마다, 최대 20 * 5 만큼의 버퍼가 차있지 않더라도, 로그를 저장.
    schedule.scheduleJob('Chat-autoInsert', '*/10 * * * *', () => {
      console.log('=================== Chat-autoInsert ====================');
      console.log('[TIME]: ', new Date().toLocaleString());

      let allChats = [];
      this.clients.map((client) => {
        // 한곳에 데이터를 모은다.
        allChats = allChats.concat(client.chats);

        // 데이터 삭제하여 메모리 공간 확보
        client.initalizeChats();
        return client;
      });
      console.log(`[Store request] - ${allChats.length} chats`);
      console.log(allChats);

      const insertQuery = `
        INSERT INTO twitchChat
        ( creatorId, time, name, userId, subscriber, manager, badges, text )
        VALUES`;
      const [insertQueryArray, queryValues] = createChatInsertQueryValues(allChats);

      // Reqeust query to DB
      doQuery(insertQuery + queryValues, insertQueryArray).then((row) => {
        if (!row.error && row.result) {
          console.log(`[Insert Success] - number of row: ${allChats.length}`);
        } else {
          console.log('[DB적재 에러]');
        }
      }).catch((err) => {
        console.log('err', err);
      });
    });
  }

  this.createClient = createClient;
  this.getStatus = getStatus;
  this.start = start;
}

module.exports = TwitchChatCollector;
