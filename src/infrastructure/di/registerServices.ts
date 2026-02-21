import { S3FileStorageService } from "@infrastructure/file-storage/S3FileStorageService";
import { IFileStorageService } from "@application/services/IFileStorageService";

export interface RegisteredServices {
  fileStorageService: IFileStorageService;
}

export function registerServices(): RegisteredServices {
  const fileStorageService = new S3FileStorageService();

  return {
    fileStorageService
  };
}

