import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getObject, getSignedUrl } from '@cloud-burger/aws-wrappers';
import { InternalServerError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Readable } from 'stream';
import { streamToBuffer } from 'utils/stream-to-buffer';
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

  async getByKey(key: string): Promise<Buffer> {
    const object = await getObject({
      Bucket: this.storageName,
      Key: key,
    });

    if (!object.Body || !(object.Body instanceof Readable)) {
      logger.error({
        message: 'Invalid S3 object',
        data: object,
      });

      throw new InternalServerError('Invalid S3 object Body');
    }

    return await streamToBuffer(object.Body);
  }
}
