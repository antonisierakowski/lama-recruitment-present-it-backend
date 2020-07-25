import { Container } from 'inversify';
import { PresentationServiceInterface } from './PresentationServiceInterface';
import { presentationModule } from './serviceIdentifiers';
import { PresentationService } from './PresentationService';

export const presentationModuleLoader = (container: Container): void => {
  container
    .bind<PresentationServiceInterface>(presentationModule.PresentationService)
    .to(PresentationService);
};
