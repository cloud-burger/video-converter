import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@cloud-burger/aws-wrappers';
import { VideoStorage as IVideoStorage } from '~/domain/storage/video-storage';

export class VideoStorage implements IVideoStorage {
  constructor(private storageName: string) {}

  async getUrlByKey(key: string): Promise<string> {
    const url = await getSignedUrl(
      new PutObjectCommand({
        Bucket: this.storageName,
        Key: key,
      }),
    );

    return url;
  }

  getByKey(key: string): Promise<Buffer> {
    throw new Error('Method not implemented.');
  }
}
