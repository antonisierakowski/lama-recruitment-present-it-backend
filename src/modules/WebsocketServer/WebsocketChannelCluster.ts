import { WebsocketChannelInterface } from './WebsocketChannelInterface';
import { WebsocketChannel } from './WebsocketChannel';
import WebSocket from 'ws';
import { WebsocketChannelClusterInterface } from './WebsocketChannelClusterInterface';
import { injectable } from 'inversify';
import { omit } from 'lodash';

type WSChannels = Record<string, WebsocketChannelInterface>;

@injectable()
export class WebsocketChannelCluster
  implements WebsocketChannelClusterInterface {
  private channels: WSChannels = {};

  addConnection(id: string, connection: WebSocket): void {
    if (!this.channels[id]) {
      this.createChannel(id);
    }
    const connectionId = Symbol();
    this.channels[id].addConnection(connectionId, connection);
    connection.on('close', () => {
      this.channels[id].removeConnection(connectionId);
      this.removeChannelIfEmpty(id);
    });
  }

  notifyChannel<TData>(id: string, message: TData): void {
    const parsedData = JSON.stringify(message);
    if (!this.channels[id]) {
      this.createChannel(id);
    }
    this.channels[id].notifyChannel(parsedData);
  }

  private createChannel(id: string): void {
    this.channels[id] = new WebsocketChannel();
  }

  private removeChannelIfEmpty(channelId: string): void {
    if (this.channels[channelId].isEmpty) {
      this.channels = omit(this.channels, channelId);
    }
  }
}
