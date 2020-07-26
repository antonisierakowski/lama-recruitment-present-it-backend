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
import {
  mapMimeHeader,
  handleError,
  PRESENTATION_OWNER_COOKIE_VAL,
  sendResponse,
} from './utils';
import { StatusCode } from './StatusCode';
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
      this.setPresentationOwnerCookie(res, result.presentation.id);
      sendResponse(res, StatusCode.OK, result);
    } catch (error) {
      handleError(res, error);
    }
  }

  @httpGet('/:presentationId')
  async getPresentation(req: Request, res: Response): Promise<void> {
    try {
      const {
        presentationFile,
        fileType,
      } = await this.presentationService.getPresentation(
        req.params.presentationId,
      );
      res.writeHead(StatusCode.OK, {
        'Cache-Control': 'public, max-age=86400000',
        ...mapMimeHeader(fileType),
      });
      res.end(presentationFile);
    } catch (error) {
      handleError(res, error);
    }
  }

  @httpGet('/:presentationId/metadata')
  async getPresentationMetadata(req: Request, res: Response): Promise<void> {
    const { presentationId } = req.params;
    const isPresentationOwnerCookie = req.cookies[presentationId];

    try {
      const result = await this.presentationService.getPresentationWithMetadata(
        presentationId,
        isPresentationOwnerCookie,
      );
      sendResponse(res, StatusCode.OK, result);
    } catch (error) {
      handleError(res, error);
    }
  }

  @httpPut('/:presentationId')
  async updatePresentation(req: Request, res: Response): Promise<void> {
    const { presentationId } = req.params;
    const newSlideNumber = req.body.currentSlide;
    const isPresentationOwnerCookie = req.cookies[presentationId];

    try {
      await this.presentationService.updatePresentationCurrentSlide(
        presentationId,
        newSlideNumber,
        isPresentationOwnerCookie,
      );
      sendResponse(res, StatusCode.OK);
    } catch (error) {
      handleError(res, error);
    }
  }

  @httpDelete('/:presentationId')
  async deletePresentation(req: Request, res: Response): Promise<void> {
    const { presentationId } = req.params;
    const isPresentationOwnerCookie = req.cookies[presentationId];

    try {
      await this.presentationService.removePresentation(
        presentationId,
        isPresentationOwnerCookie,
      );
      sendResponse(res, StatusCode.OK);
    } catch (error) {
      handleError(res, error);
    }
  }

  private setPresentationOwnerCookie(
    res: Response,
    presentationId: string,
  ): void {
    res.cookie(presentationId, PRESENTATION_OWNER_COOKIE_VAL);
  }
}
