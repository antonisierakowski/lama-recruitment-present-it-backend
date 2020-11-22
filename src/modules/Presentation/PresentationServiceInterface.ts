import {
  GetPresentationWithMetadataResponse,
  UploadedPresentation,
  PresentationEntityResponse,
} from './types';
import { ReadStream } from 'fs';

export interface PresentationServiceInterface {
  uploadPresentation(
    presentation: UploadedPresentation,
  ): Promise<PresentationEntityResponse>;

  getPresentation(presentationId: string): Promise<ReadStream>;

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
