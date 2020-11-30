import { Readable } from 'stream';
import { ReadStream } from 'fs';

export interface FileStorageServiceInterface {
  saveFile(file: Readable, name: string): Promise<void>;

  getFile(fileName: string): ReadStream;

  removeFile(fileName: string): Promise<void>;
}
