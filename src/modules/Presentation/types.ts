import { Readable } from 'stream';

export interface PresentationDbRow {
  id: string;
  number_of_slides: number;
  current_slide: number;
  file_name: string;
}

export enum PresentationFileExtension {
  PPTX = '.pptx',
  PDF = '.pdf',
}

export const PresentationMIMEType = new Map<string, PresentationFileExtension>([
  ['application/pdf', PresentationFileExtension.PDF],
  [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    PresentationFileExtension.PPTX,
  ],
]);

export type UploadedPresentation = {
  fileType: PresentationFileExtension;
  presentationStream: Readable;
};

export interface Presentation {
  id?: string;
  numberOfSlides: number;
  currentSlide: number;
  fileName: string;
}

export interface PresentationMetadata {
  isOwner: boolean;
}

export interface PresentationEntityResponse {
  presentation: PresentationDbRow;
}

export interface GetPresentationWithMetadataResponse {
  presentation: PresentationDbRow;
  metadata: PresentationMetadata;
}
