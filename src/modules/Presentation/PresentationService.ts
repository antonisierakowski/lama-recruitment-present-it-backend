import {
  PresentationServiceInterface,
  UploadedPresentation,
} from './PresentationServiceInterface';
import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '../../exceptions';
import { injectable } from 'inversify';
import * as path from 'path';

export enum FileExtension {
  PPTX = '.pptx',
  PDF = '.pdf',
}

@injectable()
export class PresentationService implements PresentationServiceInterface {
  async uploadPresentation(files: UploadedPresentation): Promise<void> {
    if (!files || !files.presentation) {
      throw new BadRequestException();
    }

    const { presentation } = files;

    const fileExtension = path.extname(presentation.name) as FileExtension;
    if (!Object.values(FileExtension).includes(fileExtension)) {
      throw new UnsupportedMediaTypeException();
    }

    // pdf service or pptx service will analyze it and get noOfPages

    // file service saves the file in static folder and gets the url

    // finally, the db provider will save the url, noOfPages, current=1, and id, then return the entity to the user
  }
}
