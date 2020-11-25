import { BaseMiddleware } from 'inversify-express-utils';
import { inject, injectable } from 'inversify';
import { authorizationModule } from '../Authorization/serviceIdentifiers';
import { AuthorizationServiceInterface } from '../Authorization/AuthorizationServiceInterface';
import { handleError } from '../controllers/utils';
import { ForbiddenException, throwIf } from '../../exceptions';
import { NextFunction, Request, Response } from 'express';

@injectable()
export class ValidatePresentationOwnerMiddleware extends BaseMiddleware {
  constructor(
    @inject(authorizationModule.AuthorizationService)
    private _jwtAuthorizationService: AuthorizationServiceInterface,
  ) {
    super();
  }

  handler(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.presentationId;
      const token = req.cookies[id];

      throwIf(token, new ForbiddenException());

      const isValid = this._jwtAuthorizationService.verify(token, id);

      throwIf(!isValid, new ForbiddenException());
      next();
    } catch (error) {
      handleError(res, error);
    }
  }
}
