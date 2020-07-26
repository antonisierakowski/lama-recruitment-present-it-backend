import { PresentationServiceInterface } from './PresentationServiceInterface';
import {
  BadRequestException,
  UnsupportedMediaTypeException,
  ResourceNotFoundException,
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
  PresentationFileWithFileExtension,
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

    console.log(presentationDataBuffer.byteLength);

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
      fileType: fileExtension,
    });
  }

  async getPresentation(
    presentationId: string,
  ): Promise<PresentationFileWithFileExtension> {
    let fileName: string;
    let fileType: PresentationFileExtension;
    try {
      const presentation = await this.presentationProvider.getPresentationEntity(
        presentationId,
      );
      fileName = presentation.file_name;
      fileType = presentation.file_type;
    } catch (error) {
      throw new ResourceNotFoundException();
    }

    const presentationFile = await this.fileStorageService.getFile(fileName);

    return {
      presentationFile,
      fileType,
    };
  }
}
