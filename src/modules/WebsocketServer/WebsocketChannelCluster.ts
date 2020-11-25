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
  private _channels: WSChannels = {};

  addConnection(id: string, connection: WebSocket): void {
    if (!this._channels[id]) {
      this._createChannel(id);
    }
    const connectionId = Symbol();
    this._channels[id].addConnection(connectionId, connection);
    connection.on('close', () => {
      this._channels[id].removeConnection(connectionId);
      this._removeChannelIfEmpty(id);
    });
  }

  notifyChannel<TData>(id: string, message: TData): void {
    const parsedData = JSON.stringify(message);
    if (!this._channels[id]) {
      this._createChannel(id);
    }
    this._channels[id].notifyChannel(parsedData);
  }

  private _createChannel(id: string): void {
    this._channels[id] = new WebsocketChannel();
  }

  private _removeChannelIfEmpty(channelId: string): void {
    if (this._channels[channelId].isEmpty) {
      this._channels = omit(this._channels, channelId);
    }
  }
}
