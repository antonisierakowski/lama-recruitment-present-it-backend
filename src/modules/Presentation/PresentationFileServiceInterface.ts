export interface PresentationFileServiceInterface {
  getNumberOfSlides(file: Buffer): Promise<number>;
}
