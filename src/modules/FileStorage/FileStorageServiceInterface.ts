export interface FileStorageServiceInterface {
  saveFile(file: Buffer, fileName: string): Promise<string>;

  getFile(path: string): Promise<Buffer>;

  removeFile(path: string): Promise<void>;
}
