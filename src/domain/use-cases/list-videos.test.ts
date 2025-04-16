import { mock, MockProxy } from 'jest-mock-extended';
import { makeVideo } from 'tests/factories/make-video';
import { VideoStatus } from '../entities/enums/video-status';
import { VideoRepository } from '../repositories/video';
import { ListVideosUseCase } from './list-videos';

describe('Use cases - List videos', () => {
  let videoRepository: MockProxy<VideoRepository>;
  let listVideosUseCase: ListVideosUseCase;

  beforeAll(() => {
    videoRepository = mock();
    listVideosUseCase = new ListVideosUseCase(videoRepository);
  });

  it('should list videos successfully', async () => {
    videoRepository.findMany.mockResolvedValue([makeVideo()]);

    const videos = await listVideosUseCase.execute({
      page: '1',
      size: '10',
      userId: '8336d93d-a599-4703-9a28-357e61db4dae',
      status: VideoStatus.UPLOADED,
    });

    expect(videos).toEqual([
      {
        createdAt: new Date('2024-10-20T00:00:00.000Z'),
        file: { frames: 's3://frames.zip', video: 's3://video.mp4' },
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        status: 'UPLOADED',
        updatedAt: new Date('2024-10-20T00:00:00.000Z'),
        user: {
          email: 'user@email.com',
          id: '8336d93d-a599-4703-9a28-357e61db4dae',
        },
      },
    ]);
    expect(videoRepository.findMany).toHaveBeenNthCalledWith(1, {
      page: '1',
      size: '10',
      status: 'UPLOADED',
      userId: '8336d93d-a599-4703-9a28-357e61db4dae',
    });
  });
});
