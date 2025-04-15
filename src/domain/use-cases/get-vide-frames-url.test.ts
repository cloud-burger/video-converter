import { mock, MockProxy } from 'jest-mock-extended';
import { makeVideo } from 'tests/factories/make-video';
import { VideoStatus } from '../entities/enums/video-status';
import { VideoRepository } from '../repositories/video';
import { FrameStorage } from '../storage/image-storage';
import { GetVideoFramesUrlUseCase } from './get-video-frames-url';

describe('Use cases - Get video frames url', () => {
  let videoRepository: MockProxy<VideoRepository>;
  let frameStorage: MockProxy<FrameStorage>;
  let getVideoFramesUrlUseCase: GetVideoFramesUrlUseCase;

  beforeAll(() => {
    videoRepository = mock();
    frameStorage = mock();
    getVideoFramesUrlUseCase = new GetVideoFramesUrlUseCase(
      videoRepository,
      frameStorage,
    );
  });

  it('should throw not found error when video does not exists', async () => {
    videoRepository.findByIdAndUserId.mockResolvedValue(null);
    frameStorage.getUrlByKey.mockResolvedValue('https://s3.upload.com.br');

    try {
      await getVideoFramesUrlUseCase.execute({
        userId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        videoId: '8336d93d-a599-4703-9a28-357e61db4dae',
      });
    } catch (error) {
      expect(error.toObject()).toEqual({ reason: 'Video not found' });
    }
    expect(videoRepository.findByIdAndUserId).toHaveBeenNthCalledWith(
      1,
      '8336d93d-a599-4703-9a28-357e61db4dae',
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(frameStorage.getUrlByKey).not.toHaveBeenCalled();
  });

  it('should throw bad request error when video frames are not processed', async () => {
    videoRepository.findByIdAndUserId.mockResolvedValue(
      makeVideo({
        status: VideoStatus.PROCESSING,
        file: {
          video: 's3://video.mp4',
        },
      }),
    );
    frameStorage.getUrlByKey.mockResolvedValue('https://s3.upload.com.br');

    try {
      await getVideoFramesUrlUseCase.execute({
        userId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        videoId: '8336d93d-a599-4703-9a28-357e61db4dae',
      });
    } catch (error) {
      expect(error.toObject()).toEqual({
        reason: 'Video frames not processed',
      });
    }
    expect(videoRepository.findByIdAndUserId).toHaveBeenNthCalledWith(
      1,
      '8336d93d-a599-4703-9a28-357e61db4dae',
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(frameStorage.getUrlByKey).not.toHaveBeenCalled();
  });

  it('should throw not found error when video frames url are not available', async () => {
    videoRepository.findByIdAndUserId.mockResolvedValue(
      makeVideo({
        status: VideoStatus.PROCESSED,
        file: {
          video: 's3://video.mp4',
        },
      }),
    );
    frameStorage.getUrlByKey.mockResolvedValue('https://s3.upload.com.br');

    try {
      await getVideoFramesUrlUseCase.execute({
        userId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        videoId: '8336d93d-a599-4703-9a28-357e61db4dae',
      });
    } catch (error) {
      expect(error.toObject()).toEqual({
        reason: 'Video frames url are not available',
      });
    }

    expect(videoRepository.findByIdAndUserId).toHaveBeenNthCalledWith(
      1,
      '8336d93d-a599-4703-9a28-357e61db4dae',
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(frameStorage.getUrlByKey).not.toHaveBeenCalled();
  });

  it('should get video frames url successfully', async () => {
    videoRepository.findByIdAndUserId.mockResolvedValue(
      makeVideo({
        status: VideoStatus.PROCESSED,
      }),
    );
    frameStorage.getUrlByKey.mockResolvedValue('https://s3.upload.com.br');

    const url = await getVideoFramesUrlUseCase.execute({
      userId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      videoId: '8336d93d-a599-4703-9a28-357e61db4dae',
    });

    expect(url).toEqual('https://s3.upload.com.br');
    expect(videoRepository.findByIdAndUserId).toHaveBeenNthCalledWith(
      1,
      '8336d93d-a599-4703-9a28-357e61db4dae',
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(frameStorage.getUrlByKey).toHaveBeenNthCalledWith(
      1,
      's3://frames.zip',
    );
  });
});
