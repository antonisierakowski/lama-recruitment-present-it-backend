import '../config/dotenv';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import container from '../config/container';
import { ProcessSignal, rootRoute } from '../modules/baseConstants';
import { applyMiddleware } from '../config/applyMiddleware';
import Knex from 'knex';
import { dbModule } from '../modules/db/serviceIdentifiers';

const restServerPort = process.env.REST_API_PORT || 8000;

(async () => {
  const server = new InversifyExpressServer(container, null, {
    rootPath: rootRoute,
  });
  server.setConfig(applyMiddleware);
  const restApi = server.build();
  const restApiInstance = restApi.listen(restServerPort);
  console.log(`REST server started listening on port ${restServerPort}...`);

  process.on(ProcessSignal.SIGINT, handleExit);
  process.on(ProcessSignal.SIGTERM, handleExit);

  async function handleExit(signal: string) {
    console.log(`\nReceived ${signal}, initialising graceful shutdown...`);
    restApiInstance.close(() => {
      console.log('Rest server closed succesfuly.');
    });
    const dbConnection = container.get<Knex>(dbModule.ConnectionInstance);
    await dbConnection.destroy();
    process.exit(0);
  }
})();
