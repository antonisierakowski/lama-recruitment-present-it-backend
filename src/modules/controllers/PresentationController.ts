import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  interfaces,
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { presentationModule } from '../Presentation/serviceIdentifiers';
import { PresentationServiceInterface } from '../Presentation/PresentationServiceInterface';
import { handleError, sendResponse } from './utils';
import { StatusCode } from '../../StatusCode';
import { UploadedPresentation } from '../Presentation/types';

@controller('/presentation')
export class PresentationController implements interfaces.Controller {
  constructor(
    @inject(presentationModule.PresentationService)
    private presentationService: PresentationServiceInterface,
  ) {}

  @httpPost('')
  async uploadPresentation(req: Request, res: Response): Promise<void> {
    const { files } = req;
    try {
      const result = await this.presentationService.uploadPresentation(
        files as UploadedPresentation,
      );
      sendResponse(res, StatusCode.OK, result);
    } catch (error) {
      handleError(res, error);
    }
  }

  @httpGet('/:presentationId')
  async getPresentation(req: Request, res: Response): Promise<void> {
    try {
      sendResponse(res, StatusCode.OK);
    } catch (error) {
      handleError(res, error);
    }
  }

  @httpPut('/:presentationId')
  async updatePresentation(req: Request, res: Response): Promise<void> {
    try {
      sendResponse(res, StatusCode.OK);
    } catch (error) {
      handleError(res, error);
    }
  }

  @httpDelete('/:presentationId')
  async deletePresentation(req: Request, res: Response): Promise<void> {
    try {
      sendResponse(res, StatusCode.OK);
    } catch (error) {
      handleError(res, error);
    }
  }
}
