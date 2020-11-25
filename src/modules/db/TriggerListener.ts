import { TriggerListenerInterface } from './TriggerListenerInterface';
import { inject, injectable } from 'inversify';
import { websocketServerModule } from '../WebsocketServer/serviceIdentifiers';
import { WebsocketChannelClusterInterface } from '../WebsocketServer/WebsocketChannelClusterInterface';
import { dbModule } from './serviceIdentifiers';
import Knex from 'knex';
import { PresentationDbRow } from '../Presentation/types';
import pg from 'pg';

interface NotificationResponseMessage {
  payload: string;
  length: number;
  processId: number;
  channel: string;
  name: string;
}

@injectable()
export class TriggerListener implements TriggerListenerInterface {
  private _rawConnection: pg.Connection;

  constructor(
    @inject(websocketServerModule.WebsocketChannelCluster)
    private _wsChannelCluster: WebsocketChannelClusterInterface,
    @inject(dbModule.ConnectionInstance) private _connection: Knex,
  ) {}

  async connectAndStartListening(): Promise<void> {
    this._rawConnection = await this._connection.client.acquireRawConnection();
    this._rawConnection.query('LISTEN new_event');
    this._rawConnection.on('notification', this._notify.bind(this));
  }

  closeConnection(): void {
    this._rawConnection.end();
  }

  private _notify(data: NotificationResponseMessage) {
    const presentationEntity = JSON.parse(data.payload) as PresentationDbRow;
    this._wsChannelCluster.notifyChannel<PresentationDbRow>(
      presentationEntity.id,
      presentationEntity,
    );
  }
}
