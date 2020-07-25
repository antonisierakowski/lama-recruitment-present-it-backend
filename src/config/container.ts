import 'reflect-metadata';
import { BindingScopeEnum, Container } from 'inversify';
import { controllerModuleLoader } from '../modules/controllers/module';
import { websocketServerModuleLoader } from '../modules/WebsocketServer/module';
import { presentationModuleLoader } from '../modules/Presentation/module';
import { fileStorageModuleLoader } from '../modules/FileStorage/module';

export type ModuleLoader = (container: Container) => void;

const container = new Container({
  defaultScope: BindingScopeEnum.Singleton,
});

const modules: ModuleLoader[] = [
  controllerModuleLoader,
  websocketServerModuleLoader,
  presentationModuleLoader,
  fileStorageModuleLoader,
];

modules.forEach(module => module(container));

export default container;
