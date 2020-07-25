import './config/dotenv';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { applyMiddleware } from './middleware';
import container from './config/container';

const port = process.env.REST_API_PORT || 8000;

(async () => {
  const server = new InversifyExpressServer(container);
  server.setConfig(applyMiddleware);
  const app = server.build();
  await app.listen(port);
  console.log(`Rest server started listening on port ${port}...`);

  process.on('SIGINT', () => {
    console.log('received SIGINT');
    process.exit();
  });
})();
