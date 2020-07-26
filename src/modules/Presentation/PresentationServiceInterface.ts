import {
  GetPresentationWithMetadataResponse,
  PresentationDbRow,
  PresentationFileWithFileExtension,
  PresentationWithMetadata,
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
}
