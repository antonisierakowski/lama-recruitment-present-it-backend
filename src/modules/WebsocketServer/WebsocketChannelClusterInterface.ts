import WebSocket from 'ws';

export interface WebsocketChannelClusterInterface {
  addConnection(id: string, connection: WebSocket): void;

  notifyChannel<TData>(id: string, message: TData): void;
}
