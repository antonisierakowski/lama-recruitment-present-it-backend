import { PresentationServiceInterface } from './PresentationServiceInterface';
import {
  BadRequestException,
  ForbiddenException,
  ResourceNotFoundException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '../../exceptions';
import { inject, injectable } from 'inversify';
import { presentationModule } from './serviceIdentifiers';
import { PdfServiceInterface } from './PdfServiceInterface';
import { fileStorageModule } from '../FileStorage/serviceIdentifiers';
import { FileStorageServiceInterface } from '../FileStorage/FileStorageServiceInterface';
import {
  GetPresentationWithMetadataResponse,
  PresentationEntityResponse,
  PresentationFileExtension,
  UploadedPresentation,
} from './types';
import { PresentationDbProviderInterface } from './PresentationDbProviderInterface';
import { PRESENTATION_OWNER_COOKIE_VAL } from '../controllers/utils';
import { isEmpty } from 'lodash';
import { ReadStream } from 'fs';
import ReadableStreamClone from 'readable-stream-clone';

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
    uploadedPresentation: UploadedPresentation,
  ): Promise<PresentationEntityResponse> {
    // todo remember to handle it in middleware
    // if (!files || !files.presentation || isArray(files.presentation)) {
    //   throw new BadRequestException();
    // }

    let { presentationStream } = uploadedPresentation;
    const { fileType } = uploadedPresentation;
    this.checkIfFileIsSupported(fileType);

    if (fileType === PresentationFileExtension.PPTX) {
      presentationStream = this.pdfService.convertToPdf(presentationStream);
    }

    const presentationStreamCopy = new ReadableStreamClone(presentationStream);
    const presentationStreamCopyForSlideCount = new ReadableStreamClone(
      presentationStream,
    );

    let numberOfSlides: number;
    try {
      numberOfSlides = await this.pdfService.getNumberOfSlides(
        presentationStreamCopyForSlideCount,
      );
    } catch (error) {
      throw new BadRequestException();
    }

    const fileName = await this.fileStorageService.saveFile(
      presentationStreamCopy,
    );

    try {
      const presentationEntity = await this.presentationProvider.insertPresentationEntity(
        {
          fileName,
          numberOfSlides,
          currentSlide: 1,
        },
      );

      return {
        presentation: presentationEntity,
      };
    } catch (error) {
      await this.fileStorageService.removeFile(fileName);
      throw error;
    }
  }

  async getPresentation(presentationId: string): Promise<ReadStream> {
    const presentation = await this.presentationProvider.getPresentationEntity(
      presentationId,
    );

    if (!presentation) {
      throw new ResourceNotFoundException();
    }

    const { file_name: fileName } = presentation;

    return await this.fileStorageService.getFile(fileName);
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

  private checkIfFileIsSupported(
    fileExtension: PresentationFileExtension,
  ): boolean {
    if (Object.values(PresentationFileExtension).includes(fileExtension)) {
      return true;
    }
    throw new UnsupportedMediaTypeException();
  }
}
