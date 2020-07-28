import {
  GetPresentationWithMetadataResponse,
  PresentationFileWithFileExtension,
  UploadedPresentation,
  PresentationEntityResponse,
} from './types';

export interface PresentationServiceInterface {
  uploadPresentation(
    files: UploadedPresentation,
  ): Promise<PresentationEntityResponse>;

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
  ): Promise<PresentationEntityResponse>;

  removePresentation(
    presentationId: string,
    presentationOwnerCookie: string,
  ): Promise<void>;
}
