import { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';

export const applyMiddleware = (app: Application): void => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(morgan('tiny'));
  app.use(fileUpload());
};
