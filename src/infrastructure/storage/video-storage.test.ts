import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { getObject, getSignedUrl } from '@cloud-burger/aws-wrappers';
import { Readable } from 'stream';
import { VideoStorage } from './video-storage';

jest.mock('@cloud-burger/aws-wrappers');

describe('Infrastructure - Storage - Video', () => {
  const getObjectMock = jest.mocked(getObject);
  const getSignedUrlMock = jest.mocked(getSignedUrl);
  let videoStorage: VideoStorage;

  beforeAll(() => {
    videoStorage = new VideoStorage('video-converter-bucket');
  });

  it('should get url by key successfully', async () => {
    getSignedUrlMock.mockResolvedValue('https://s3.upload.com.br');

    const url = await videoStorage.getUrlByKey(
      'videos/416ffb24-0c0d-4a8f-97ec-c6ee21d5423f/f4746383-942d-4211-96bd-56c78b8da4b0',
    );

    expect(url).toEqual('https://s3.upload.com.br');
  });

  it('should throw internal server error while get object by key when body is not set', async () => {
    getObjectMock.mockResolvedValue({
      $metadata: {},
    });

    await expect(
      videoStorage.getByKey(
        'videos/416ffb24-0c0d-4a8f-97ec-c6ee21d5423f/f4746383-942d-4211-96bd-56c78b8da4b0',
      ),
    ).rejects.toThrow('Invalid S3 object Body');

    expect(getObjectMock).toHaveBeenNthCalledWith(1, {
      Bucket: 'video-converter-bucket',
      Key: 'videos/416ffb24-0c0d-4a8f-97ec-c6ee21d5423f/f4746383-942d-4211-96bd-56c78b8da4b0',
    });
  });

  it('should throw internal server error while get object by key when body is invalid', async () => {
    getObjectMock.mockResolvedValue({
      $metadata: {},
      Body: 2,
    } as unknown as GetObjectCommandOutput);

    await expect(
      videoStorage.getByKey(
        'videos/416ffb24-0c0d-4a8f-97ec-c6ee21d5423f/f4746383-942d-4211-96bd-56c78b8da4b0',
      ),
    ).rejects.toThrow('Invalid S3 object Body');

    expect(getObjectMock).toHaveBeenNthCalledWith(1, {
      Bucket: 'video-converter-bucket',
      Key: 'videos/416ffb24-0c0d-4a8f-97ec-c6ee21d5423f/f4746383-942d-4211-96bd-56c78b8da4b0',
    });
  });

  it('should get object by key successfully', async () => {
    getObjectMock.mockResolvedValue({
      $metadata: {},
      Body: Readable.from(['test']),
    } as unknown as GetObjectCommandOutput);

    const video = await videoStorage.getByKey(
      'videos/416ffb24-0c0d-4a8f-97ec-c6ee21d5423f/f4746383-942d-4211-96bd-56c78b8da4b0',
    );

    expect(video).toBeInstanceOf(Buffer);
    expect(video.toString()).toEqual('test');
    expect(getObjectMock).toHaveBeenNthCalledWith(1, {
      Bucket: 'video-converter-bucket',
      Key: 'videos/416ffb24-0c0d-4a8f-97ec-c6ee21d5423f/f4746383-942d-4211-96bd-56c78b8da4b0',
    });
  });
});
