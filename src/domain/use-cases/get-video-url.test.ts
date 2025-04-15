import { randomUUID } from 'crypto';
import { mock, MockProxy } from 'jest-mock-extended';
import { VideoRepository } from '../repositories/video';
import { VideoStorage } from '../storage/video-storage';
import { GetVideoUrlUseCase } from './get-video-url';

jest.mock('crypto');

describe('Use Cases - Get Video Url', () => {
  const randomUUIDMock = jest.mocked(randomUUID);
  let videoRepository: MockProxy<VideoRepository>;
  let videoStorage: MockProxy<VideoStorage>;
  let getVideoUrlUseCase: GetVideoUrlUseCase;

  beforeAll(() => {
    videoRepository = mock();
    videoStorage = mock();
    getVideoUrlUseCase = new GetVideoUrlUseCase(videoRepository, videoStorage);
  });

  it('should get video url successfully', async () => {
    randomUUIDMock.mockReturnValue('3082e467-edef-46b0-8acd-660a47be259a');
    videoStorage.getUrlByKey.mockResolvedValue('https://s3.upload.com.br');
    videoRepository.save.mockResolvedValue();

    const url = await getVideoUrlUseCase.execute({
      user: {
        email: 'user@test.com',
        id: 'f4746383-942d-4211-96bd-56c78b8da4b0',
      },
    });

    expect(url).toEqual('https://s3.upload.com.br');
    expect(videoStorage.getUrlByKey).toHaveBeenNthCalledWith(
      1,
      'videos/f4746383-942d-4211-96bd-56c78b8da4b0/3082e467-edef-46b0-8acd-660a47be259a.mp4',
    );
    expect(videoRepository.save).toHaveBeenNthCalledWith(1, {
      createdAt: expect.any(Date),
      file: {
        video:
          'videos/f4746383-942d-4211-96bd-56c78b8da4b0/3082e467-edef-46b0-8acd-660a47be259a.mp4',
      },
      id: '3082e467-edef-46b0-8acd-660a47be259a',
      status: 'WAITING_UPLOAD',
      updatedAt: expect.any(Date),
      user: {
        email: 'user@test.com',
        id: 'f4746383-942d-4211-96bd-56c78b8da4b0',
      },
    });
  });
});
