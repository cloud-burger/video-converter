import { getSignedUrl } from '@cloud-burger/aws-wrappers';
import { VideoStorage } from './video-storage';

jest.mock('@cloud-burger/aws-wrappers');

describe('Infrastructure - Storage - Video', () => {
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
});
