import tmi from 'tmi.js';
import io from 'socket.io-client';
import onConnectedHandler from './handlers/onConnected';
import onJoinHandler from './handlers/onJoin';
import onMessageHandler from './handlers/onMessage';
import onDisconnectedHandler from './handlers/onDisconnected';
import onReconnectHandler from './handlers/onReconnected';
import { Campaign } from './interfaces/Campaign.interface';
import onQuitHandler from './handlers/onQuitHandler';
import timeoutAsync from '../../lib/timeoutAsync';
import connectDB, { AgreedCreator } from '../../model/connectDB';
import OnAdScheduler from '../../lib/scheduler';

export interface ChatBotOptions extends tmi.Options {
  chatPrefix?: string;
  SOCKET_HOSTNAME: string;
}

export default class ChatBot {
  client: tmi.Client;
  private socketClient: SocketIOClient.Socket;
  private chatPrefix: string;
  private joinDoneFlag = true; // join작업 완료 플래그
  private quitDoneFlag = true; // quit작업 완료 플래그

  constructor(options: ChatBotOptions) {
    this.client = tmi.Client(options);
    this.socketClient = io(options.SOCKET_HOSTNAME);
    this.chatPrefix = options.chatPrefix || '지금 나오고 있는 광고가 궁금하다면?\n';

    this.setHandlers();
    this.setHandlersSocketServer();
  }

  /**
   * tmi 챗봇 클라이언트 핸들러 설정 메서드
   */
  private setHandlers(): tmi.Client {
    this.client.on('connected', onConnectedHandler);
    this.client.on('join', onJoinHandler);
    this.client.on('message', onMessageHandler);
    this.client.on('disconnected', onDisconnectedHandler);
    this.client.on('reconnect', onReconnectHandler);
    this.client.on('part', onQuitHandler);
    return this.client;
  }

  /**
   * 온애드 광고 송출 socket 서버의 광고 송출 이벤트 핸들러 설정 메서드
   */
  private setHandlersSocketServer(): SocketIOClient.Socket {
    this.socketClient.on('next-campaigns-twitch-chatbot', (data: Campaign) => {
      console.log('광고 송출서버로부터 next-campaigns-twitch-chatbot 요청 받음.');
      const channels = this.client.getChannels().map((channel) => channel.replace('#', ''));

      if (data.creatorTwitchId && channels.includes(data.creatorTwitchId)) {
        this.executeAdchat(data.creatorTwitchId, data.descriptionToChat || undefined);
      }
    });
    return this.socketClient;
  }

  /**
   * 채팅을 특정 채널에 보냅니다.
   * @param channel 채팅을 보낼 채널
   * @param message 보낼 채팅 메시지
   */
  private async executeChat(channel: string, message: string): Promise<any> {
    return this.client.say(channel, message)
      .catch((err) => {
        console.log(`[${new Date().toLocaleString()}] ${channel}, sayAdMessage error - ${err}`);
        return err;
      });
  }

  /**
   * tmi 챗봇 클라이언트 접속 메서드
   */
  private async connectTmi(): Promise<tmi.Client> {
    await this.client.connect();
    return this.client;
  }

  /**
   * 온애드 광고송출 socket 서버 접속 메소드
   */
  private async connectSocketServer(): Promise<SocketIOClient.Socket> {
    return this.socketClient.connect();
  }

  public async connect(): Promise<void> {
    await this.connectTmi();
    await this.connectSocketServer();
  }

  /**
   * channelName 인자를 통해 요청된 특정 트위치 채널의 채팅방에 접속합니다.
   * @param channelName 접속할 채널명. 개별 채널명 또는 "," 을 구분자로 한 채널명 여러개.  
   * @example joinChannel("streamer0,streamer1,streamer2");
   * @example joinChannel("streamer0");
   */
  public async joinChannel(channelName: string): Promise<void> {
    return this.client.join(channelName)
      .then((channels) => {
        console.log(`Successfully join channel - ${channels[0]}`);
      })
      .catch((err: any) => { console.log(`channel(${channelName}) join error: ${err}`); });
  }

  /**
   * channelName 인자를 통해 요청된 특정 트위치 채널의 채팅방에서 나갑니다.
   * @param channelName 채팅방에서 나갈 채널명
   */
  public async quitChannel(channelName: string): Promise<void> {
    return this.client.part(channelName)
      .then((channels) => { console.log(`Successfully quit channel - ${channels[0]}`); })
      .catch((err: any) => { console.log(`channel(${channelName}) quit error: ${err}`); });
  }

  /**
   * 특정 방송인에게 광고 채팅을 송출합니다.
   * @param channel 광고 채팅을 보낼 채널명
   * @param adDescription 광고 채팅에 적힐 현재 송출 중 캠페인의 홍보문구
   */
  private async executeAdchat(channel: string, adDescription?: string): Promise<void> {
    const adString = `https://t.onad.io/adchat/${channel}`;
    const adMessage = `${adDescription || this.chatPrefix}\n${adString}`;
    console.log('**************************************************');
    console.log(`[${new Date().toLocaleString()}] 광고채팅전송 - ${channel}, ${adMessage}`);
    return this.executeChat(channel, adMessage);
  }

  /**
   * 트위치 채널 채팅방에 접속합니다.
   * @param targetCreators 접속할 채널 목록
   */
  public async joinAgreedChannels(targetCreators: AgreedCreator[]): Promise<void> {
    console.log('**************************************************');
    console.log('챗봇 ON 채널 접속 작업 시작 - ', targetCreators.map((c) => c.creatorTwitchId));
    timeoutAsync(targetCreators, (item, idx) => {
      this.joinDoneFlag = false;
      this.joinChannel(item.creatorTwitchId);
      if (targetCreators.length - 1 === idx) {
        this.joinDoneFlag = true;
        console.log('챗봇 ON 채널 접속 작업 완료');
      }
    }, process.env.NODE_ENV === 'production' ? 3000 : 1000); // 프로덕션의 경우 안정성을 위해 5초, 로컬에서는 1초
  }

  /**
   * 트위치 채널 채팅방에서 나갑니다.
   * @param targetCreators 나갈 채널 목록
   */
  public async quitAgreedChannels(targetCreators: string[]): Promise<void> {
    console.log('**************************************************');
    console.log('챗봇 OFF로 인한 채널 나가기 작업 시작 - ', targetCreators);
    timeoutAsync(targetCreators, (item, idx) => {
      this.quitDoneFlag = false;
      this.quitChannel(item);
      if (targetCreators.length - 1 === idx) {
        this.quitDoneFlag = true;
        console.log('챗봇 OFF로 인한 채널 나가기 작업 완료');
      }
    }, process.env.NODE_ENV === 'production' ? 3000 : 1000); // 프로덕션의 경우 안정성을 위해 5초, 로컬에서는 1초
  }

  // ********************************************************************
  // Scheduling funcitons

  /**
   * 채팅봇 동의 상태를 새롭게 ON상태로 변경항 크리에이터 / 새롭게 OFF상태로 변경한 크리에이터를 처리하는 메서드
   */
  private async newCreatorProcess(): Promise<void> {
    const creators = await connectDB.getContratedCreators();
    const channels = this.client.getChannels().map((channel) => channel.replace('#', ''));

    if (this.joinDoneFlag) {
      // 챗봇 기능 ON설정하여 새로운 크리에이터
      // (channels 에는 없으나, creators 에는 있는 크리에이터)
      const newCreators = creators.filter(
        (cre) => !(channels.includes(cre.creatorTwitchId))
      );
      if (newCreators.length > 0) this.joinAgreedChannels(newCreators);
    } else {
      console.log('previous JOIN tasks are processing now!');
      console.log('so, skip the JOIN tasks this time');
    }

    if (this.quitDoneFlag) {
      // 챗봇 기능 OFF설정하여 나간 크리에이터
      // (channels 에는 있으나, creators 에는 없는 크리에이터)
      const creatorTwitchIds = creators.map((c) => c.creatorTwitchId);
      const quitCreators = channels.filter(
        (cre) => !(creatorTwitchIds.includes(cre))
      );
      if (quitCreators.length > 0) this.quitAgreedChannels(quitCreators);
    } else {
      console.log('previous QUIT tasks are processing now!');
      console.log('so, skip the QUIT tasks this time');
    }
  }


  private healthCheck() {
    console.log('================== Health Check ==================');
    console.log('<상주중인 채널>');
    console.log(this.client.getChannels());
    console.log(`<채널join 작업 여부> - ${this.joinDoneFlag ? '작업중아님' : '작업중'}`);
    console.log(`<채널quit 작업 여부> - ${this.quitDoneFlag ? '작업중아님' : '작업중'}`);
  }

  /**
   * 스케쥴러 실행 메서드
   */
  public runSchedulers(): void {
    const healthCheckSchedular = new OnAdScheduler(
      'healthCheck', '* * * * *', this.healthCheck.bind(this),
    );

    const newCreatorScheduler = new OnAdScheduler(
      'newCreatorProcess', '*/2 * * * *', this.newCreatorProcess.bind(this),
    );

    console.log(`RUN SCHEDULER - ${healthCheckSchedular.name}`);
    console.log(`RUN SCHEDULER - ${newCreatorScheduler.name}`);
  }
}
