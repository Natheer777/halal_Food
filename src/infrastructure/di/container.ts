
import { registerRepositories, RegisteredRepositories } from "@infrastructure/di/registerRepositories";
import { registerServices, RegisteredServices } from "@infrastructure/di/registerServices";
import { registerUseCases, RegisteredUseCases } from "@infrastructure/di/registerUseCases";

export interface Container
  extends RegisteredRepositories,
    RegisteredServices,
    RegisteredUseCases {}

let containerInstance: Container | null = null;

export function getContainer(): Container {
  if (containerInstance) {
    return containerInstance;
  }

  const repositories = registerRepositories();
  const services = registerServices();
  const useCases = registerUseCases({
    ...repositories,
    ...services
  });

  containerInstance = {
    ...repositories,
    ...services,
    ...useCases
  };

  return containerInstance;
}

