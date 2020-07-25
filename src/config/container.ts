import 'reflect-metadata';
import { BindingScopeEnum, Container } from 'inversify';
import { controllerModuleLoader } from '../controllers/module';

export type ModuleLoader = (container: Container) => void;

const container = new Container({
  defaultScope: BindingScopeEnum.Singleton,
});

const modules: ModuleLoader[] = [controllerModuleLoader];

modules.forEach(module => module(container));

export default container;
