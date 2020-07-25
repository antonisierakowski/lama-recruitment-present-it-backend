import { Container } from 'inversify';
import { controllerModule } from './serviceIdentifiers';
import { PresentationController } from './PresentationController';

export const controllerModuleLoader = (container: Container): void => {
  container.bind(controllerModule.Controller).to(PresentationController);
};
