export interface FileStorageServiceInterface {
  saveFile(file: Buffer, fileName: string): Promise<string>;

  getFile(fileName: string): Promise<Buffer>;

  removeFile(fileName: string): Promise<void>;
}
