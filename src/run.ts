import './config/dotenv';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { applyMiddleware } from './config/expressMiddleware';
import container from './config/container';
import { websocketServerModule } from './modules/WebsocketServer/serviceIdentifiers';
import { WebsocketServerInterface } from './modules/WebsocketServer/WebsocketServerInterface';
import { TriggerListenerInterface } from './modules/db/TriggerListenerInterface';
import { dbModule } from './modules/db/serviceIdentifiers';
import Knex from 'knex';
import { ProcessSignal, rootRoute } from './modules/baseConstants';

const restServerPort = process.env.REST_API_PORT || 8000;
const websocketServerPort = process.env.WEBSOCKET_PORT || 8080;

(async () => {
  const server = new InversifyExpressServer(container, null, {
    rootPath: rootRoute,
  });
  server.setConfig(applyMiddleware);
  const restApi = server.build();
  const restApiInstance = restApi.listen(restServerPort);
  console.log(`REST server started listening on port ${restServerPort}...`);

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

  async function handleExit() {
    dbTriggerListener.closeConnection();
    console.log('\nReceived SIGINT, initialising graceful shutdown...');
    restApiInstance.close(() => {
      console.log('Rest server closed succesfuly.');
    });
    const dbConnection = container.get<Knex>(dbModule.ConnectionInstance);
    await dbConnection.destroy();
    await wsServer.close();
    console.log('Websocket server closed succesfuly.');
    process.exit(0);
  }
})();
