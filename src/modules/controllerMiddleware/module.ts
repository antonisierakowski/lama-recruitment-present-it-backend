import { Container } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { controllerMiddlewareModule } from './serviceIdentifiers';
import { UploadPresentationMiddleware } from './UploadPresentationMiddleware';
import { ValidatePresentationOwnerMiddleware } from './ValidatePresentationOwnerMiddleware';

export const controllerMiddlewareModuleLoader = (
  container: Container,
): void => {
  container
    .bind<BaseMiddleware>(
      controllerMiddlewareModule.UploadPresentationMiddleware,
    )
    .to(UploadPresentationMiddleware);
  container
    .bind<BaseMiddleware>(
      controllerMiddlewareModule.ValidatePresentationOwnerMiddleware,
    )
    .to(ValidatePresentationOwnerMiddleware);
};
