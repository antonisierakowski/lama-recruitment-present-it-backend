import { FileSystemStorageService } from './FileSystemStorageService';
import { Container } from 'inversify';
import { FileStorageServiceInterface } from './FileStorageServiceInterface';
import { fileStorageModule } from './serviceIdentifiers';
import { isProd } from '../utils';
import { S3StorageService } from './S3StorageService';

export const fileStorageModuleLoader = (container: Container): void => {
  container
    .bind<FileStorageServiceInterface>(fileStorageModule.FileStorageService)
    .to(isProd() ? S3StorageService : FileSystemStorageService);
};
