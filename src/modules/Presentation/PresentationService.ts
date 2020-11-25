import { PresentationServiceInterface } from './PresentationServiceInterface';
import {
  BadRequestException,
  ResourceNotFoundException,
  throwIf,
  UnprocessableEntityException,
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
import { isEmpty } from 'lodash';
import { ReadStream } from 'fs';
import ReadableStreamClone from 'readable-stream-clone';
import { authorizationModule } from '../Authorization/serviceIdentifiers';
import { AuthorizationServiceInterface } from '../Authorization/AuthorizationServiceInterface';

@injectable()
export class PresentationService implements PresentationServiceInterface {
  constructor(
    @inject(presentationModule.PdfService)
    private _pdfService: PdfServiceInterface,
    @inject(fileStorageModule.FileStorageService)
    private _fileStorageService: FileStorageServiceInterface,
    @inject(presentationModule.PresentationDbProvider)
    private _presentationProvider: PresentationDbProviderInterface,
    @inject(authorizationModule.AuthorizationService)
    private _jwtAuthorizationService: AuthorizationServiceInterface,
  ) {}

  async uploadPresentation(
    uploadedPresentation: UploadedPresentation,
  ): Promise<PresentationEntityResponse> {
    let { presentationStream } = uploadedPresentation;
    const { fileType } = uploadedPresentation;

    if (fileType === PresentationFileExtension.PPTX) {
      presentationStream = this._pdfService.convertToPdf(presentationStream);
    }

    const presentationStreamCopy = new ReadableStreamClone(presentationStream);
    const presentationStreamCopyForSlideCount = new ReadableStreamClone(
      presentationStream,
    );

    let numberOfSlides: number;
    try {
      numberOfSlides = await this._pdfService.getNumberOfSlides(
        presentationStreamCopyForSlideCount,
      );
    } catch (error) {
      throw new BadRequestException();
    }

    const fileName = await this._fileStorageService.saveFile(
      presentationStreamCopy,
    );

    try {
      const presentationEntity = await this._presentationProvider.insertPresentationEntity(
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
      await this._fileStorageService.removeFile(fileName);
      throw error;
    }
  }

  async getPresentation(presentationId: string): Promise<ReadStream> {
    const presentation = await this._presentationProvider.getPresentationEntity(
      presentationId,
    );

    throwIf(!presentation, new ResourceNotFoundException());

    const { file_name: fileName } = presentation;

    return await this._fileStorageService.getFile(fileName);
  }

  async getPresentationWithMetadata(
    presentationId: string,
    ownerToken: string,
  ): Promise<GetPresentationWithMetadataResponse> {
    const presentationEntity = await this._presentationProvider.getPresentationEntity(
      presentationId,
    );

    throwIf(isEmpty(presentationEntity), new ResourceNotFoundException());

    const isRequesterPresentationOwner = this._jwtAuthorizationService.verify(
      ownerToken,
      presentationId,
    );

    return {
      presentation: presentationEntity,
      metadata: {
        isOwner: isRequesterPresentationOwner,
      },
    };
  }

  async updatePresentationCurrentSlide(
    presentationId: string,
    newSlideNumber: number,
  ): Promise<PresentationEntityResponse> {
    throwIf(!newSlideNumber, new UnprocessableEntityException());

    const result = await this._presentationProvider.updatePresentationEntity({
      currentSlide: newSlideNumber,
      id: presentationId,
    });

    return {
      presentation: result,
    };
  }

  async removePresentation(presentationId: string): Promise<void> {
    const removedEntity = await this._presentationProvider.deletePresentationEntity(
      presentationId,
    );
    throwIf(isEmpty(removedEntity), new ResourceNotFoundException());

    await this._fileStorageService.removeFile(removedEntity.file_name);
  }
}
