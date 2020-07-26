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
  private rawConnection: pg.Connection;

  constructor(
    @inject(websocketServerModule.WebsocketChannelCluster)
    private wsChannelCluster: WebsocketChannelClusterInterface,
    @inject(dbModule.ConnectionInstance) private connection: Knex,
  ) {}

  async connectAndStartListening(): Promise<void> {
    this.rawConnection = await this.connection.client.acquireRawConnection();
    this.rawConnection.query('LISTEN new_event');
    this.rawConnection.on('notification', this.notify.bind(this));
  }

  closeConnection(): void {
    this.rawConnection.end();
  }

  private notify(data: NotificationResponseMessage) {
    const presentationEntity = JSON.parse(data.payload) as PresentationDbRow;
    this.wsChannelCluster.notifyChannel<PresentationDbRow>(
      presentationEntity.id,
      presentationEntity,
    );
  }
}
