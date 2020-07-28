import { PresentationServiceInterface } from './PresentationServiceInterface';
import {
  BadRequestException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  ForbiddenException,
  ResourceNotFoundException,
} from '../../exceptions';
import { inject, injectable, named } from 'inversify';
import * as path from 'path';
import { presentationModule } from './serviceIdentifiers';
import { PresentationFileServiceInterface } from './PresentationFileServiceInterface';
import { fileStorageModule } from '../FileStorage/serviceIdentifiers';
import { FileStorageServiceInterface } from '../FileStorage/FileStorageServiceInterface';
import {
  GetPresentationWithMetadataResponse,
  PresentationDbRow,
  PresentationFileExtension,
  PresentationFileWithFileExtension,
  UploadedPresentation,
  PresentationEntityResponse,
} from './types';
import { PresentationDbProviderInterface } from './PresentationDbProviderInterface';
import { PRESENTATION_OWNER_COOKIE_VAL } from '../controllers/utils';
import { isEmpty, isArray } from 'lodash';

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
  ): Promise<PresentationEntityResponse> {
    if (!files || !files.presentation || isArray(files.presentation)) {
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

    let numberOfSlides: number;

    try {
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
        default: {
          throw new UnsupportedMediaTypeException();
        }
      }
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
          fileType: fileExtension,
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

    const { file_name: fileName, file_type: fileType } = presentation;

    const presentationFile = await this.fileStorageService.getFile(fileName);

    return {
      presentationFile,
      fileType,
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
}
