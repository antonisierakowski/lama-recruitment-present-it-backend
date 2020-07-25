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
import { presentationModule } from '../modules/Presentation/serviceIdentifiers';
import { PresentationServiceInterface } from '../modules/Presentation/PresentationServiceInterface';

@controller('/presentation')
export class PresentationController implements interfaces.Controller {
  constructor(
    @inject(presentationModule.PresentationService)
    private presentationService: PresentationServiceInterface,
  ) {}

  @httpPost('')
  async uploadPresentation(req: Request, res: Response): Promise<void> {
    const { files } = req;
  }

  @httpGet('/:presentationId')
  async getPresentation(req: Request, res: Response): Promise<void> {}

  @httpPut('/:presentationId')
  async updatePresentation(req: Request, res: Response): Promise<void> {}

  @httpDelete('/:presentationId')
  async deletePresentation(req: Request, res: Response): Promise<void> {}
}
