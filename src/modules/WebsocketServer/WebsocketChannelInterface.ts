import WebSocket from 'ws';

export interface WebsocketChannelInterface {
  notifyChannel(data: string): void;

  addConnection(connection: WebSocket): void;
}
