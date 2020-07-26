import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  interfaces,
  requestBody,
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { presentationModule } from '../Presentation/serviceIdentifiers';
import { PresentationServiceInterface } from '../Presentation/PresentationServiceInterface';
import { handleError, sendResponse } from './utils';
import { StatusCode } from './StatusCode';
import { PresentationDbRow, UploadedPresentation } from '../Presentation/types';

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
      this.setPresentationOwnerCookie(res, result);
      sendResponse(res, StatusCode.OK, { presentation: result });
    } catch (error) {
      handleError(res, error);
    }
  }

  @httpGet('/:presentationId')
  async getPresentation(req: Request, res: Response): Promise<void> {
    try {
      const file = await this.presentationService.getPresentation(
        req.params.presentationId,
      );

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

  private setPresentationOwnerCookie(
    res: Response,
    presentation: PresentationDbRow,
  ) {
    res.cookie(presentation.id, 'PRES_OWNER');
  }
}
