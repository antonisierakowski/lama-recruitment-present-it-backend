import { NextFunction, Request, Response } from 'express';
import {
  BadRequestException,
  PayloadTooLargeException,
  throwIf,
  UnsupportedMediaTypeException,
} from '../../exceptions';
import Busboy from 'busboy';
import { Readable } from 'stream';
import path from 'path';
import {
  PresentationFileExtension,
  PresentationMIMEType,
  UploadedPresentation,
} from '../Presentation/types';
import { handleError } from '../controllers/utils';
import { BaseMiddleware } from 'inversify-express-utils';
import { injectable } from 'inversify';

export const MAX_FILE_SIZE = 1e8;

export interface PresentationUploadRequest extends Request {
  presentation: UploadedPresentation;
}

@injectable()
export class UploadPresentationMiddleware extends BaseMiddleware {
  handler(req: PresentationUploadRequest, res: Response, next: NextFunction) {
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
  }
}
