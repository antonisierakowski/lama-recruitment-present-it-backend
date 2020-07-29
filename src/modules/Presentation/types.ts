import { UploadedFile } from 'express-fileupload';

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

export type UploadedPresentation = {
  presentation: UploadedFile;
};

export interface ParsedPresentationXmlFile {
  Properties: {
    Slides: string[];
  };
}

export interface Presentation {
  id?: string;
  numberOfSlides: number;
  currentSlide: number;
  fileName: string;
}

export interface PresentationMetadata {
  isOwner: boolean;
}

export interface PresentationFileWithFileExtension {
  presentationFile: Buffer;
}

export interface PresentationEntityResponse {
  presentation: PresentationDbRow;
}

export interface GetPresentationWithMetadataResponse {
  presentation: PresentationDbRow;
  metadata: PresentationMetadata;
}
