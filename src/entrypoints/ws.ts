import '../config/dotenv';
import 'reflect-metadata';
import container from '../config/container';
import { WebsocketServerInterface } from '../modules/WebsocketServer/WebsocketServerInterface';
import { websocketServerModule } from '../modules/WebsocketServer/serviceIdentifiers';
import { TriggerListenerInterface } from '../modules/db/TriggerListenerInterface';
import { dbModule } from '../modules/db/serviceIdentifiers';
import { ProcessSignal } from '../modules/baseConstants';
import Knex from 'knex';

const websocketServerPort = process.env.WEBSOCKET_PORT || 8080;

(async () => {
  const wsServer = container.get<WebsocketServerInterface>(
    websocketServerModule.WebsocketServer,
  );
  await wsServer.open(websocketServerPort as number);

  const dbTriggerListener = container.get<TriggerListenerInterface>(
    dbModule.TriggerListener,
  );
  await dbTriggerListener.connectAndStartListening();

  process.on(ProcessSignal.SIGINT, handleExit);
  process.on(ProcessSignal.SIGTERM, handleExit);

  async function handleExit(signal: string) {
    dbTriggerListener.closeConnection();
    console.log(`\nReceived ${signal}, initialising graceful shutdown...`);
    const dbConnection = container.get<Knex>(dbModule.ConnectionInstance);
    await dbConnection.destroy();
    await wsServer.close();
    console.log('Websocket server closed succesfuly.');
    process.exit(0);
  }
})();
