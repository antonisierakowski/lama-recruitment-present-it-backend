import path from 'path';
import { FileStorageServiceInterface } from './FileStorageServiceInterface';
import { injectable } from 'inversify';
import shortid from 'shortid';
import { ResourceNotFoundException } from '../../exceptions';
import * as utils from './utils';

@injectable()
export class FileStorageService implements FileStorageServiceInterface {
  protected readonly path: string = './__static';

  async saveFile(file: Buffer): Promise<string> {
    const fileName = shortid.generate();
    const fullPath = path.join(this.path, fileName);
    if (!(await utils.doesFileExist(this.path))) {
      await utils.mkDir(this.path);
    }
    await utils.writeFile(fullPath, file);
    return fileName;
  }

  async getFile(fileName: string): Promise<Buffer> {
    const fullPath = path.join(this.path, fileName);
    try {
      return utils.readFile(fullPath);
    } catch (error) {
      throw new ResourceNotFoundException();
    }
  }

  async removeFile(fileName: string): Promise<void> {
    const fullPath = path.join(this.path, fileName);
    const doesFileExist = await utils.doesFileExist(this.path);
    if (!doesFileExist) {
      throw new ResourceNotFoundException();
    }
    await utils.removeFile(fullPath);
  }
}
