import 'reflect-metadata';
import { BindingScopeEnum, Container } from 'inversify';
import { controllerModuleLoader } from '../modules/controllers/module';
import { websocketServerModuleLoader } from '../modules/WebsocketServer/module';
import { presentationModuleLoader } from '../modules/Presentation/module';
import { fileStorageModuleLoader } from '../modules/FileStorage/module';
import { dbModuleLoader } from '../modules/db/module';
import { authorizationModuleLoader } from '../modules/Authorization/module';
import { controllerMiddlewareModuleLoader } from '../modules/controllerMiddleware/module';

export type ModuleLoader = (container: Container) => void;

const container = new Container({
  defaultScope: BindingScopeEnum.Singleton,
});

const modules: ModuleLoader[] = [
  controllerMiddlewareModuleLoader,
  controllerModuleLoader,
  websocketServerModuleLoader,
  presentationModuleLoader,
  fileStorageModuleLoader,
  dbModuleLoader,
  authorizationModuleLoader,
];

modules.forEach(module => module(container));

export default container;
