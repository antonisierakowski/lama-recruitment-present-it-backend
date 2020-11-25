import { Container } from 'inversify';
import { authorizationModule } from './serviceIdentifiers';
import { AuthorizationServiceInterface } from './AuthorizationServiceInterface';
import { JWTAuthorizationService } from './JWTAuthorizationService';

export const authorizationModuleLoader = (container: Container): void => {
  container
    .bind<AuthorizationServiceInterface>(
      authorizationModule.AuthorizationService,
    )
    .to(JWTAuthorizationService);
};
