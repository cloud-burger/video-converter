import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@cloud-burger/aws-wrappers';
import { FrameStorage as IFrameStorage } from '~/domain/storage/image-storage';

export class FrameStorage implements IFrameStorage {
  constructor(private storageName: string) {}

  async getUrlByKey(key: string): Promise<string> {
    const url = await getSignedUrl(
      new GetObjectCommand({
        Bucket: this.storageName,
        Key: key,
      }),
    );

    return url;
  }
  save(id: string, file: Buffer): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
