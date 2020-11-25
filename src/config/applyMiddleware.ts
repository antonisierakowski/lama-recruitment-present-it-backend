import { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

export const applyMiddleware = (app: Application): void => {
  app.use(
    cors({
      origin: process.env.FRONTEND_DOMAIN,
      credentials: true,
      exposedHeaders: ['set-cookie'],
    }),
  );
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(morgan('tiny'));
};
