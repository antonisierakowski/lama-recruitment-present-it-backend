import { FileSystemStorageService } from './FileSystemStorageService';
import { Container } from 'inversify';
import { FileStorageServiceInterface } from './FileStorageServiceInterface';
import { fileStorageModule } from './serviceIdentifiers';

export const fileStorageModuleLoader = (container: Container): void => {
  container
    .bind<FileStorageServiceInterface>(fileStorageModule.FileStorageService)
    .to(FileSystemStorageService);
};
