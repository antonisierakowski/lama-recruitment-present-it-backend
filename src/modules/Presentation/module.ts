import { Container } from 'inversify';
import { PresentationServiceInterface } from './PresentationServiceInterface';
import { presentationModule } from './serviceIdentifiers';
import { PresentationService } from './PresentationService';
import { PresentationFileServiceInterface } from './PresentationFileServiceInterface';
import { PdfService } from './PdfService';
import { PptxService } from './PptxService';

export const presentationModuleLoader = (container: Container): void => {
  container
    .bind<PresentationServiceInterface>(presentationModule.PresentationService)
    .to(PresentationService);
  container
    .bind<PresentationFileServiceInterface>(
      presentationModule.PresentationFileService,
    )
    .to(PdfService)
    .whenTargetNamed('PdfService');
  container
    .bind<PresentationFileServiceInterface>(
      presentationModule.PresentationFileService,
    )
    .to(PptxService)
    .whenTargetNamed('PptxService');
};
