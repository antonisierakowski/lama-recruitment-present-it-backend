import { PresentationServiceInterface } from './PresentationServiceInterface';
import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '../../exceptions';
import { inject, injectable, named } from 'inversify';
import * as path from 'path';
import { presentationModule } from './serviceIdentifiers';
import { PresentationFileServiceInterface } from './PresentationFileServiceInterface';
import { fileStorageModule } from '../FileStorage/serviceIdentifiers';
import { FileStorageServiceInterface } from '../FileStorage/FileStorageServiceInterface';
import {
  PresentationDbRow,
  PresentationFileExtension,
  UploadedPresentation,
} from './types';
import { PresentationDbProviderInterface } from './PresentationDbProviderInterface';

@injectable()
export class PresentationService implements PresentationServiceInterface {
  constructor(
    @inject(presentationModule.PresentationFileService)
    @named('PptxService')
    private pptxService: PresentationFileServiceInterface,
    @inject(presentationModule.PresentationFileService)
    @named('PdfService')
    private pdfService: PresentationFileServiceInterface,
    @inject(fileStorageModule.FileStorageService)
    private fileStorageService: FileStorageServiceInterface,
    @inject(presentationModule.PresentationDbProvider)
    private presentationProvider: PresentationDbProviderInterface,
  ) {}

  async uploadPresentation(
    files: UploadedPresentation,
  ): Promise<PresentationDbRow> {
    if (!files || !files.presentation) {
      throw new BadRequestException();
    }

    const {
      presentation: {
        data: presentationDataBuffer,
        name: presentationFileName,
      },
    } = files;

    const fileExtension = path.extname(
      presentationFileName,
    ) as PresentationFileExtension;
    if (!Object.values(PresentationFileExtension).includes(fileExtension)) {
      throw new UnsupportedMediaTypeException();
    }

    let numberOfSlides: number;
    switch (fileExtension) {
      case PresentationFileExtension.PDF: {
        numberOfSlides = await this.pdfService.getNumberOfSlides(
          presentationDataBuffer,
        );
        break;
      }
      case PresentationFileExtension.PPTX: {
        numberOfSlides = await this.pptxService.getNumberOfSlides(
          presentationDataBuffer,
        );
        break;
      }
    }

    const fileName = await this.fileStorageService.saveFile(
      presentationDataBuffer,
      presentationFileName,
    );

    return this.presentationProvider.insertPresentationEntity({
      fileName,
      numberOfSlides,
      currentSlide: 1,
    });
    // finally, the db provider will save the url, noOfPages, current=1, and id, then return the entity to the user
  }
}