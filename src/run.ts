import './config/dotenv';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { applyMiddleware } from './config/expressMddleware';
import container from './config/container';
import { websocketServerModule } from './modules/WebsocketServer/serviceIdentifiers';
import { WebsocketServerInterface } from './modules/WebsocketServer/WebsocketServerInterface';

const restServerPort = process.env.REST_API_PORT || 8000;
const websocketServerPort = process.env.WEBSOCKET_PORT || 8080;

(async () => {
  const server = new InversifyExpressServer(container);
  server.setConfig(applyMiddleware);
  const restApi = server.build();
  const restApiInstance = await restApi.listen(restServerPort);
  console.log(`Rest server started listening on port ${restServerPort}...`);

  const wsServer = container.get<WebsocketServerInterface>(
    websocketServerModule.WebsocketServer,
  );
  await wsServer.open(websocketServerPort as number);

  process.on('SIGINT', async () => {
    console.log('received SIGINT');
    restApiInstance.close(() => {
      console.log('rest server closed succesfuly');
    });
    await wsServer.close();
    console.log('websocket server closed succesfuly');
    process.exit();
  });
})();
