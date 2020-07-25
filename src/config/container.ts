import 'reflect-metadata';
import { BindingScopeEnum, Container } from 'inversify';

export type ModuleLoader = (container: Container) => void;

const container = new Container({
  defaultScope: BindingScopeEnum.Singleton,
});

const modules: ModuleLoader[] = [];

modules.forEach(module => module(container));

export default container;
