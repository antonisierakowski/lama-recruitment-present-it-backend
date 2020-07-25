export interface PresentationFileServiceInterface {
  getNumberOfPages(file: Buffer): Promise<number>;
}
