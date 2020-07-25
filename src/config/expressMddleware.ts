import { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

export const applyMiddleware = (app: Application) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(morgan('tiny'));
};
