import { VideoStorage as IVideoStorage } from '~/domain/storage/video-storage';

export class VideoStorage implements IVideoStorage {
  constructor(private storageName: string) {}

  getUrl(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  save(id: string, file: Buffer): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
