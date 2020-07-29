import { Container } from 'inversify';
import { PresentationServiceInterface } from './PresentationServiceInterface';
import { presentationModule } from './serviceIdentifiers';
import { PresentationService } from './PresentationService';
import { PdfServiceInterface } from './PdfServiceInterface';
import { PdfService } from './PdfService';
import { PresentationDbProviderInterface } from './PresentationDbProviderInterface';
import { PresentationDbProvider } from './PresentationDbProvider';

export const presentationModuleLoader = (container: Container): void => {
  container
    .bind<PresentationServiceInterface>(presentationModule.PresentationService)
    .to(PresentationService);
  container
    .bind<PdfServiceInterface>(presentationModule.PdfService)
    .to(PdfService);
  container
    .bind<PresentationDbProviderInterface>(
      presentationModule.PresentationDbProvider,
    )
    .to(PresentationDbProvider);
};
