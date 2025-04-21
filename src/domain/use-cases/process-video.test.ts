import { mock, MockProxy } from 'jest-mock-extended';
import { makeVideo } from 'tests/factories/make-video';
import { FileCompressorHandler } from '~/infrastructure/file/compressor-handler';
import { FrameExtractorHandler } from '~/infrastructure/file/frame-extractor-handler';
import { VideoStatus } from '../entities/enums/video-status';
import { VideoPublisher } from '../publisher/video-publisher';
import { VideoRepository } from '../repositories/video';
import { FrameStorage } from '../storage/image-storage';
import { VideoStorage } from '../storage/video-storage';
import { ProcessVideoUseCase } from './process-video';

describe('Use cases - Process video', () => {
  let videoRepository: MockProxy<VideoRepository>;
  let videoStorage: MockProxy<VideoStorage>;
  let frameStorage: MockProxy<FrameStorage>;
  let frameExtractorHandler: MockProxy<FrameExtractorHandler>;
  let fileCompressorHandler: MockProxy<FileCompressorHandler>;
  let videoPublisher: MockProxy<VideoPublisher>;
  let processVideoUseCase: ProcessVideoUseCase;

  beforeAll(() => {
    videoRepository = mock();
    videoStorage = mock();
    frameStorage = mock();
    frameExtractorHandler = mock();
    fileCompressorHandler = mock();
    videoPublisher = mock();
    processVideoUseCase = new ProcessVideoUseCase(
      videoRepository,
      videoStorage,
      frameStorage,
      frameExtractorHandler,
      fileCompressorHandler,
      videoPublisher,
    );
  });

  it('should throw not found error when video does not exists', async () => {
    videoRepository.findByIdAndUserId.mockResolvedValue(null);

    await expect(
      processVideoUseCase.execute({
        videoId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        userId: '8336d93d-a599-4703-9a28-357e61db4dae',
      }),
    ).rejects.toThrow('Video not found');

    expect(videoRepository.findByIdAndUserId).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      '8336d93d-a599-4703-9a28-357e61db4dae',
    );
    expect(videoRepository.update).not.toHaveBeenCalled();
    expect(videoStorage.getByKey).not.toHaveBeenCalled();
    expect(frameExtractorHandler.extractFromBuffer).not.toHaveBeenCalled();
    expect(fileCompressorHandler.compress).not.toHaveBeenCalled();
    expect(frameStorage.save).not.toHaveBeenCalled();
    expect(videoPublisher.publish).not.toHaveBeenCalled();
  });

  it('should return when video has already been processed', async () => {
    videoRepository.findByIdAndUserId.mockResolvedValue(
      makeVideo({
        status: VideoStatus.PROCESSED,
      }),
    );

    await processVideoUseCase.execute({
      videoId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      userId: '8336d93d-a599-4703-9a28-357e61db4dae',
    });

    expect(videoRepository.findByIdAndUserId).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      '8336d93d-a599-4703-9a28-357e61db4dae',
    );
    expect(videoRepository.update).not.toHaveBeenCalled();
    expect(videoStorage.getByKey).not.toHaveBeenCalled();
    expect(frameExtractorHandler.extractFromBuffer).not.toHaveBeenCalled();
    expect(fileCompressorHandler.compress).not.toHaveBeenCalled();
    expect(frameStorage.save).not.toHaveBeenCalled();
    expect(videoPublisher.publish).not.toHaveBeenCalled();
  });

  it('should return when error while process video frames', async () => {
    videoRepository.findByIdAndUserId.mockResolvedValue(makeVideo());
    videoStorage.getByKey.mockResolvedValue(new Buffer('test'));
    frameExtractorHandler.extractFromBuffer.mockRejectedValue(
      new Error('Error'),
    );

    await processVideoUseCase.execute({
      videoId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      userId: '8336d93d-a599-4703-9a28-357e61db4dae',
    });

    expect(videoRepository.findByIdAndUserId).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      '8336d93d-a599-4703-9a28-357e61db4dae',
    );
    expect(videoRepository.update).toHaveBeenNthCalledWith(1, {
      createdAt: expect.any(Date),
      file: { frames: 's3://frames.zip', video: 's3://video.mp4' },
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      status: 'FAILED',
      updatedAt: expect.any(Date),
      user: {
        email: 'user@email.com',
        id: '8336d93d-a599-4703-9a28-357e61db4dae',
      },
    });
    expect(videoRepository.update).toHaveBeenNthCalledWith(2, {
      createdAt: expect.any(Date),
      file: { frames: 's3://frames.zip', video: 's3://video.mp4' },
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      status: 'FAILED',
      updatedAt: expect.any(Date),
      user: {
        email: 'user@email.com',
        id: '8336d93d-a599-4703-9a28-357e61db4dae',
      },
    });
    expect(videoStorage.getByKey).toHaveBeenNthCalledWith(1, 's3://video.mp4');
    expect(frameExtractorHandler.extractFromBuffer).toHaveBeenNthCalledWith(1, {
      video: new Buffer('test'),
    });
    expect(fileCompressorHandler.compress).not.toHaveBeenCalled();
    expect(frameStorage.save).not.toHaveBeenCalled();
    expect(videoPublisher.publish).toHaveBeenNthCalledWith(1, {
      createdAt: expect.any(Date),
      file: { frames: 's3://frames.zip', video: 's3://video.mp4' },
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      status: 'FAILED',
      updatedAt: expect.any(Date),
      user: {
        email: 'user@email.com',
        id: '8336d93d-a599-4703-9a28-357e61db4dae',
      },
    });
  });

  it('should process video frames successfully', async () => {
    videoRepository.findByIdAndUserId.mockResolvedValue(makeVideo());
    videoRepository.update
      .mockResolvedValueOnce()
      .mockResolvedValueOnce()
      .mockResolvedValueOnce();
    videoStorage.getByKey.mockResolvedValue(new Buffer('test'));
    frameExtractorHandler.extractFromBuffer.mockResolvedValue([
      {
        content: new Buffer('test'),
        extension: 'jpg',
        name: 'test.jpg',
      },
    ]);
    fileCompressorHandler.compress.mockResolvedValue(new Buffer('compress'));
    frameStorage.save.mockResolvedValue();

    await processVideoUseCase.execute({
      videoId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      userId: '8336d93d-a599-4703-9a28-357e61db4dae',
    });

    expect(videoRepository.findByIdAndUserId).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      '8336d93d-a599-4703-9a28-357e61db4dae',
    );
    expect(videoRepository.update).toHaveBeenNthCalledWith(1, {
      createdAt: expect.any(Date),
      file: {
        frames:
          'frames/8336d93d-a599-4703-9a28-357e61db4dae/eba521ba-f6b7-46b5-ab5f-dd582495705e.zip',
        video: 's3://video.mp4',
      },
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      status: 'PROCESSED',
      updatedAt: expect.any(Date),
      user: {
        email: 'user@email.com',
        id: '8336d93d-a599-4703-9a28-357e61db4dae',
      },
    });
    expect(videoRepository.update).toHaveBeenNthCalledWith(2, {
      createdAt: expect.any(Date),
      file: {
        frames:
          'frames/8336d93d-a599-4703-9a28-357e61db4dae/eba521ba-f6b7-46b5-ab5f-dd582495705e.zip',
        video: 's3://video.mp4',
      },
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      status: 'PROCESSED',
      updatedAt: expect.any(Date),
      user: {
        email: 'user@email.com',
        id: '8336d93d-a599-4703-9a28-357e61db4dae',
      },
    });

    expect(videoStorage.getByKey).toHaveBeenNthCalledWith(1, 's3://video.mp4');
    expect(frameExtractorHandler.extractFromBuffer).toHaveBeenNthCalledWith(1, {
      video: new Buffer('test'),
    });
    expect(fileCompressorHandler.compress).toHaveBeenNthCalledWith(1, [
      {
        content: new Buffer('test'),
        extension: 'jpg',
        name: 'test.jpg',
      },
    ]);
    expect(frameStorage.save).toHaveBeenNthCalledWith(
      1,
      'frames/8336d93d-a599-4703-9a28-357e61db4dae/eba521ba-f6b7-46b5-ab5f-dd582495705e.zip',
      new Buffer('compress'),
    );
    expect(videoPublisher.publish).toHaveBeenNthCalledWith(1, {
      createdAt: expect.any(Date),
      file: {
        frames:
          'frames/8336d93d-a599-4703-9a28-357e61db4dae/eba521ba-f6b7-46b5-ab5f-dd582495705e.zip',
        video: 's3://video.mp4',
      },
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      status: 'PROCESSED',
      updatedAt: expect.any(Date),
      user: {
        email: 'user@email.com',
        id: '8336d93d-a599-4703-9a28-357e61db4dae',
      },
    });
  });
});
