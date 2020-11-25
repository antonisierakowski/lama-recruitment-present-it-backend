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
  sendResponse,
} from './utils';
import { StatusCode } from './StatusCode';
import { authorizationModule } from '../Authorization/serviceIdentifiers';
import { AuthorizationServiceInterface } from '../Authorization/AuthorizationServiceInterface';
import { PresentationUploadRequest } from '../controllerMiddleware/UploadPresentationMiddleware';
import { controllerMiddlewareModule } from '../controllerMiddleware/serviceIdentifiers';

@controller('/presentation')
export class PresentationController implements interfaces.Controller {
  constructor(
    @inject(presentationModule.PresentationService)
    private _presentationService: PresentationServiceInterface,
    @inject(authorizationModule.AuthorizationService)
    private _jwtAuthorizationService: AuthorizationServiceInterface,
  ) {}

  @httpPost('', controllerMiddlewareModule.UploadPresentationMiddleware)
  async uploadPresentation(
    req: PresentationUploadRequest,
    res: Response,
  ): Promise<void> {
    try {
      const result = await this._presentationService.uploadPresentation(
        req.presentation,
      );
      res.cookie(
        result.presentation.id,
        this._jwtAuthorizationService.sign(result.presentation.id),
        {
          maxAge: PRESENTATION_OWNER_COOKIE_MAX_AGE,
        },
      );
      sendResponse(res, StatusCode.OK, result);
    } catch (error) {
      handleError(res, error);
    }
  }

  @httpGet('/:presentationId')
  async getPresentation(req: Request, res: Response): Promise<void> {
    try {
      const presentationReadStream = await this._presentationService.getPresentation(
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
    const ownerToken = req.cookies[presentationId];

    try {
      const result = await this._presentationService.getPresentationWithMetadata(
        presentationId,
        ownerToken,
      );
      sendResponse(res, StatusCode.OK, result);
    } catch (error) {
      handleError(res, error);
    }
  }

  // @ts-ignore
  @httpPut(
    '/:presentationId',
    controllerMiddlewareModule.ValidatePresentationOwnerMiddleware,
  )
  async updatePresentation(req: Request, res: Response): Promise<void> {
    const { presentationId } = req.params;
    const newSlideNumber = req.body.currentSlide;

    try {
      const result = await this._presentationService.updatePresentationCurrentSlide(
        presentationId,
        newSlideNumber,
      );
      sendResponse(res, StatusCode.OK, result);
    } catch (error) {
      handleError(res, error);
    }
  }

  @httpDelete(
    '/:presentationId',
    controllerMiddlewareModule.ValidatePresentationOwnerMiddleware,
  )
  async deletePresentation(req: Request, res: Response): Promise<void> {
    const { presentationId } = req.params;

    try {
      await this._presentationService.removePresentation(presentationId);
      sendResponse(res, StatusCode.OK);
    } catch (error) {
      handleError(res, error);
    }
  }
}
