import { WebsocketChannelInterface } from './WebsocketChannelInterface';
import { injectable } from 'inversify';
import WebSocket from 'ws';
import { omit, isEmpty } from 'lodash';

@injectable()
export class WebsocketChannel implements WebsocketChannelInterface {
  private connections: Map<symbol, WebSocket> = new Map();

  get isEmpty(): boolean {
    return this.connections.size === 0;
  }

  notifyChannel(data: string): void {
    const connections = this.connections.values();
    for (const connection of connections) {
      connection.send(data);
    }
  }

  addConnection(connectionId: symbol, connection: WebSocket): void {
    this.connections.set(connectionId, connection);
  }

  removeConnection(connectionId: symbol): void {
    this.connections.delete(connectionId);
  }
}
