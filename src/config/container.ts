import 'reflect-metadata';
import { BindingScopeEnum, Container } from 'inversify';
import { controllerModuleLoader } from '../controllers/module';
import { websocketServerModuleLoader } from '../modules/WebsocketServer/module';

export type ModuleLoader = (container: Container) => void;

const container = new Container({
  defaultScope: BindingScopeEnum.Singleton,
});

const modules: ModuleLoader[] = [
  controllerModuleLoader,
  websocketServerModuleLoader,
];

modules.forEach(module => module(container));

export default container;
