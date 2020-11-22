import { Readable } from 'stream';
import { ReadStream } from 'fs';

export interface FileStorageServiceInterface {
  saveFile(file: Readable): Promise<string>;

  getFile(fileName: string): Promise<ReadStream>;

  removeFile(fileName: string): Promise<void>;
}
