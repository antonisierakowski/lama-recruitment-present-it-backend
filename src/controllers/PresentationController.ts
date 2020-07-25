import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  interfaces,
} from 'inversify-express-utils';
import { Request, Response } from 'express';

@controller('/presentation')
export class PresentationController implements interfaces.Controller {
  @httpPost('')
  async uploadPresentation(req: Request, res: Response): Promise<void> {
    res.send(req.body);
  }

  @httpGet('/:presentationId')
  async getPresentation(req: Request, res: Response): Promise<void> {
    res.send(req.params.presentationId);
  }

  @httpPut('/:presentationId')
  async updatePresentation(req: Request, res: Response): Promise<void> {
    res.send(req.params.presentationId);
  }

  @httpDelete('/:presentationId')
  async deletePresentation(req: Request, res: Response): Promise<void> {
    res.send(req.params.presentationId);
  }
}
