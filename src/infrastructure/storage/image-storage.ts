import { ImageStorage as IImageStorage } from '~/domain/storage/image-storage';

export class ImageStorage implements IImageStorage {
  constructor(private storageName: string) {}

  findById(id: string): Promise<Buffer | null> {
    throw new Error('Method not implemented.');
  }
  getUrlById(id: string, expiresIn?: number): Promise<string> {
    throw new Error('Method not implemented.');
  }
  save(id: string, file: Buffer): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
