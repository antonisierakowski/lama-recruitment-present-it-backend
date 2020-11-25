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
    ownerToken: string,
  ): Promise<GetPresentationWithMetadataResponse>;

  updatePresentationCurrentSlide(
    presentationId: string,
    newSlideNumber: number,
  ): Promise<PresentationEntityResponse>;

  removePresentation(presentationId: string): Promise<void>;
}
