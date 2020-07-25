import { WebsocketChannelInterface } from './WebsocketChannelInterface';
import { WebsocketChannel } from './WebsocketChannel';
import WebSocket from 'ws';
import { WebsocketChannelClusterInterface } from './WebsocketChannelClusterInterface';
import { injectable } from 'inversify';

type WSChannels = Record<string, WebsocketChannelInterface>;

@injectable()
export class WebsocketChannelCluster
  implements WebsocketChannelClusterInterface {
  private channels: WSChannels = {};

  addConnection(id: string, connection: WebSocket): void {
    if (!this.channels[id]) {
      this.channels[id] = new WebsocketChannel();
    }
    this.channels[id].addConnection(connection);
  }

  notifyChannel<TData>(id: string, message: TData): void {
    const parsedData = JSON.stringify(message);
    if (!this.channels[id]) {
      throw new Error(); // todo specify error
    }
    this.channels[id].notifyChannel(parsedData);
  }
}
