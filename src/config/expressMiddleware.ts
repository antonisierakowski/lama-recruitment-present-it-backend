import { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import multer from 'multer';

export const MAX_FILE_SIZE = 1e8;

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

export const uploadPresentationMiddleware = () =>
  multer({
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  }).single('presentation');
