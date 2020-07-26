import { Container } from 'inversify';
import { PresentationServiceInterface } from './PresentationServiceInterface';
import { presentationModule } from './serviceIdentifiers';
import { PresentationService } from './PresentationService';
import { PresentationFileServiceInterface } from './PresentationFileServiceInterface';
import { PdfService } from './PdfService';
import { PptxService } from './PptxService';
import xml2js from 'xml2js';
import { PresentationDbProviderInterface } from './PresentationDbProviderInterface';
import { PresentationDbProvider } from './PresentationDbProvider';

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
  container
    .bind<xml2js.Parser>(presentationModule.XmlParser)
    .toConstantValue(new xml2js.Parser());
  container
    .bind<PresentationDbProviderInterface>(
      presentationModule.PresentationDbProvider,
    )
    .to(PresentationDbProvider);
};
