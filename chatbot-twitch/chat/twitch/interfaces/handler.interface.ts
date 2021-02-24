import { ChatUserstate } from 'tmi.js';

export interface Handlers {
  onQuitHandler(channel: string, username: string, self: boolean): void;
  onConnectedHandler(address: string, port: number): void;
  onMessageHandler(channel: string, userstate: ChatUserstate, message: string, self: boolean): void;
  onDisconnectedHandler(reason: string): void;
  onJoinHandler(channel: string, username: string, self: boolean): void;
  onReconnectHandler(): void;
  onTimeoutHandler(channel: string, username: string, reason: string, duration: number): void;
  onPingHandler(): void;
  onPongHandler(latency: number): void;
}
