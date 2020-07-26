import {
  GetPresentationWithMetadataResponse,
  PresentationFileWithFileExtension,
  UploadedPresentation,
  UploadPresentationResponse,
} from './types';

export interface PresentationServiceInterface {
  uploadPresentation(
    files: UploadedPresentation,
  ): Promise<UploadPresentationResponse>;

  getPresentation(
    presentationId: string,
  ): Promise<PresentationFileWithFileExtension>;

  getPresentationWithMetadata(
    presentationId: string,
    presentationOwnerCookie: string,
  ): Promise<GetPresentationWithMetadataResponse>;

  isRequesterPresentationOwner(
    presentationId: string,
    presentationOwnerCookie: string,
  ): boolean;

  updatePresentationCurrentSlide(
    presentationId: string,
    newSlideNumber: number,
    presentationOwnerCookie: string,
  ): Promise<void>;

  removePresentation(
    presentationId: string,
    presentationOwnerCookie: string,
  ): Promise<void>;
}
