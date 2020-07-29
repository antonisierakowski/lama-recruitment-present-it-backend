import WebSocket from 'ws';

export interface WebsocketChannelInterface {
  isEmpty: boolean;

  notifyChannel(data: string): void;

  addConnection(connectionId: symbol, connection: WebSocket): void;

  removeConnection(connectionId: symbol): void;
}
