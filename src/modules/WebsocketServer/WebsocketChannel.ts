import { WebsocketChannelInterface } from './WebsocketChannelInterface';
import { injectable } from 'inversify';
import WebSocket from 'ws';

@injectable()
export class WebsocketChannel implements WebsocketChannelInterface {
  private connections: WebSocket[] = [];

  notifyChannel(data: string): void {
    this.connections.forEach(ws => ws.send(data));
  }

  addConnection(connection: WebSocket): void {
    this.connections.push(connection);
  }
}
