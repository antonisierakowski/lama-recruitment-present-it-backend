import { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { handleError } from '../modules/controllers/utils';
import { Request, Response, NextFunction } from 'express';
import {
  BadRequestException,
  UnsupportedMediaTypeException,
  PayloadTooLargeException,
  throwIf,
} from '../exceptions';
import * as path from 'path';
import {
  PresentationFileExtension,
  PresentationMIMEType,
  UploadedPresentation,
} from '../modules/Presentation/types';
import Busboy from 'busboy';
import { Readable } from 'stream';

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

export interface PresentationRequest extends Request {
  presentation: UploadedPresentation;
}

export const uploadPresentationMiddleware = (
  req: PresentationRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    throwIf(!req.headers['content-type'], new BadRequestException());

    const busboy = new Busboy({
      headers: req.headers,
      limits: {
        parts: 1,
        files: 1,
        fields: 0,
        fileSize: MAX_FILE_SIZE,
      },
    });

    let fileUploaded = true;

    busboy.on('file', function (
      fieldname: string,
      file: Readable,
      fileName: string,
      encoding: string,
      mimetype: string,
    ) {
      fileUploaded = true;

      try {
        throwIf(fieldname !== 'presentation', new BadRequestException(), () =>
          file.resume(),
        );

        const fileExtension = (path.extname(fileName) ||
          PresentationMIMEType.get(mimetype)) as PresentationFileExtension;

        throwIf(
          !Object.values(PresentationFileExtension).includes(fileExtension),
          new UnsupportedMediaTypeException(),
          () => file.resume(),
        );

        file.on('limit', () => {
          handleError(res, new PayloadTooLargeException());
        });

        req.presentation = {
          presentationStream: file,
          fileType: fileExtension,
        };
        next();
      } catch (error) {
        file.resume();
        return handleError(res, error);
      }
    });

    busboy.on('finish', () => {
      throwIf(!fileUploaded, new BadRequestException());
    });

    return req.pipe(busboy);
  } catch (error) {
    return handleError(res, error);
  }
};
