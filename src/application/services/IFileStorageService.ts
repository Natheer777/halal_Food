export interface UploadFile {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
}

export interface IFileStorageService {
  uploadCategoryImage(file: UploadFile): Promise<string>;
  uploadProductImages(files: UploadFile[]): Promise<string[]>;
}

