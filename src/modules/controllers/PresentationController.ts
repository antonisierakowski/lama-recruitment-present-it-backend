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
  handleError,
  PRESENTATION_OWNER_COOKIE_MAX_AGE,
  PRESENTATION_OWNER_COOKIE_VAL,
  sendResponse,
} from './utils';
import { StatusCode } from './StatusCode';
import { uploadPresentationMiddleware } from '../../config/expressMiddleware';

@controller('/presentation')
export class PresentationController implements interfaces.Controller {
  constructor(
    @inject(presentationModule.PresentationService)
    private presentationService: PresentationServiceInterface,
  ) {}

  @httpPost('', uploadPresentationMiddleware())
  async uploadPresentation(req: Request, res: Response): Promise<void> {
    const {
      stream: presentationStream,
      //@ts-ignore
      clientReportedFileExtension: fileType,
    } = req.file;

    try {
      const result = await this.presentationService.uploadPresentation({
        presentationStream,
        fileType,
      });
      this.setPresentationOwnerCookie(res, result.presentation.id);
      sendResponse(res, StatusCode.OK, result);
    } catch (error) {
      handleError(res, error);
    }
  }

  @httpGet('/:presentationId')
  async getPresentation(req: Request, res: Response): Promise<void> {
    try {
      const presentationReadStream = await this.presentationService.getPresentation(
        req.params.presentationId,
      );
      res.writeHead(StatusCode.OK, {
        'Cache-Control': 'private, max-age=86400000',
        'Content-Type': 'application/pdf',
      });
      presentationReadStream.pipe(res);
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
      const result = await this.presentationService.updatePresentationCurrentSlide(
        presentationId,
        newSlideNumber,
        isPresentationOwnerCookie,
      );
      sendResponse(res, StatusCode.OK, result);
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

  // todo handle presentation owner authorization with JWT, add middleware to routes that use it
  private setPresentationOwnerCookie(
    res: Response,
    presentationId: string,
  ): void {
    res.cookie(presentationId, PRESENTATION_OWNER_COOKIE_VAL, {
      maxAge: PRESENTATION_OWNER_COOKIE_MAX_AGE,
    });
  }
}
