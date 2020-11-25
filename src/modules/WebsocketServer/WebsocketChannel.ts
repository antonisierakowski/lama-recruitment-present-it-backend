import { WebsocketChannelInterface } from './WebsocketChannelInterface';
import { injectable } from 'inversify';
import WebSocket from 'ws';

@injectable()
export class WebsocketChannel implements WebsocketChannelInterface {
  private _connections: Map<symbol, WebSocket> = new Map();

  get isEmpty(): boolean {
    return this._connections.size === 0;
  }

  notifyChannel(data: string): void {
    const connections = this._connections.values();
    for (const connection of connections) {
      connection.send(data);
    }
  }

  addConnection(connectionId: symbol, connection: WebSocket): void {
    this._connections.set(connectionId, connection);
  }

  removeConnection(connectionId: symbol): void {
    this._connections.delete(connectionId);
  }
}
