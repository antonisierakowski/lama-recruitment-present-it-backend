import { PresentationServiceInterface } from './PresentationServiceInterface';
import {
  BadRequestException,
  ForbiddenException,
  ResourceNotFoundException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '../../exceptions';
import { inject, injectable } from 'inversify';
import * as path from 'path';
import { presentationModule } from './serviceIdentifiers';
import { PdfServiceInterface } from './PdfServiceInterface';
import { fileStorageModule } from '../FileStorage/serviceIdentifiers';
import { FileStorageServiceInterface } from '../FileStorage/FileStorageServiceInterface';
import {
  GetPresentationWithMetadataResponse,
  PresentationDbRow,
  PresentationEntityResponse,
  PresentationFileExtension,
  PresentationFileWithFileExtension,
  UploadedPresentation,
} from './types';
import { PresentationDbProviderInterface } from './PresentationDbProviderInterface';
import { PRESENTATION_OWNER_COOKIE_VAL } from '../controllers/utils';
import { isArray, isEmpty } from 'lodash';

@injectable()
export class PresentationService implements PresentationServiceInterface {
  constructor(
    @inject(presentationModule.PdfService)
    private pdfService: PdfServiceInterface,
    @inject(fileStorageModule.FileStorageService)
    private fileStorageService: FileStorageServiceInterface,
    @inject(presentationModule.PresentationDbProvider)
    private presentationProvider: PresentationDbProviderInterface,
  ) {}

  async uploadPresentation(
    files: UploadedPresentation,
  ): Promise<PresentationEntityResponse> {
    if (!files || !files.presentation || isArray(files.presentation)) {
      throw new BadRequestException();
    }

    const {
      presentation: { name: presentationFileName },
    } = files;
    let {
      presentation: { data: presentationDataBuffer },
    } = files;

    const fileExtension = path.extname(
      presentationFileName,
    ) as PresentationFileExtension;

    this.isFileSupported(fileExtension);

    if (fileExtension === PresentationFileExtension.PPTX) {
      presentationDataBuffer = await this.pdfService.convertToPdf(
        presentationDataBuffer,
      );
    }

    let numberOfSlides: number;
    try {
      numberOfSlides = await this.pdfService.getNumberOfSlides(
        presentationDataBuffer,
      );
    } catch (error) {
      throw new BadRequestException();
    }

    const fileName = await this.fileStorageService.saveFile(
      presentationDataBuffer,
      presentationFileName,
    );

    let presentationEntity: PresentationDbRow;

    try {
      presentationEntity = await this.presentationProvider.insertPresentationEntity(
        {
          fileName,
          numberOfSlides,
          currentSlide: 1,
        },
      );
    } catch (error) {
      await this.fileStorageService.removeFile(fileName);
      throw error;
    }

    return {
      presentation: presentationEntity,
    };
  }

  async getPresentation(
    presentationId: string,
  ): Promise<PresentationFileWithFileExtension> {
    const presentation = await this.presentationProvider.getPresentationEntity(
      presentationId,
    );

    if (!presentation) {
      throw new ResourceNotFoundException();
    }

    const { file_name: fileName } = presentation;

    const presentationFile = await this.fileStorageService.getFile(fileName);

    return {
      presentationFile,
    };
  }

  async getPresentationWithMetadata(
    presentationId: string,
    presentationOwnerCookie: string,
  ): Promise<GetPresentationWithMetadataResponse> {
    const presentationEntity = await this.presentationProvider.getPresentationEntity(
      presentationId,
    );

    if (isEmpty(presentationEntity)) {
      throw new ResourceNotFoundException();
    }

    const isRequesterPresentationOwner = this.isRequesterPresentationOwner(
      presentationId,
      presentationOwnerCookie,
    );

    return {
      presentation: presentationEntity,
      metadata: {
        isOwner: isRequesterPresentationOwner,
      },
    };
  }

  isRequesterPresentationOwner(
    presentationId: string,
    presentationOwnerCookie: string,
  ): boolean {
    if (presentationOwnerCookie === PRESENTATION_OWNER_COOKIE_VAL) {
      return true;
    }
    return false;
  }

  async updatePresentationCurrentSlide(
    presentationId: string,
    newSlideNumber: number,
    presentationOwnerCookie: string,
  ): Promise<PresentationEntityResponse> {
    const isRequesterPresentationOwner = this.isRequesterPresentationOwner(
      presentationId,
      presentationOwnerCookie,
    );
    if (!isRequesterPresentationOwner) {
      throw new ForbiddenException();
    }

    if (!newSlideNumber) {
      throw new UnprocessableEntityException();
    }

    const result = await this.presentationProvider.updatePresentationEntity({
      currentSlide: newSlideNumber,
      id: presentationId,
    });

    return {
      presentation: result,
    };
  }

  async removePresentation(
    presentationId: string,
    presentationOwnerCookie: string,
  ): Promise<void> {
    const isRequesterPresentationOwner = this.isRequesterPresentationOwner(
      presentationId,
      presentationOwnerCookie,
    );
    if (!isRequesterPresentationOwner) {
      throw new ForbiddenException();
    }

    const removedEntity = await this.presentationProvider.deletePresentationEntity(
      presentationId,
    );
    if (isEmpty(removedEntity)) {
      throw new ResourceNotFoundException();
    }

    await this.fileStorageService.removeFile(removedEntity.file_name);
  }

  private isFileSupported(fileExtension: string): boolean {
    if (!Object.keys(PresentationFileExtension).includes(fileExtension)) {
      return true;
    }
    throw new UnsupportedMediaTypeException();
  }
}
