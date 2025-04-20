import { NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { FileCompressorHandler } from '~/infrastructure/file/compressor-handler';
import { FrameExtractorHandler } from '~/infrastructure/file/frame-extractor-handler';
import { VideoStatus } from '../entities/enums/video-status';
import { Video } from '../entities/video';
import { VideoPublisher } from '../publisher/video-publisher';
import { VideoRepository } from '../repositories/video';
import { FrameStorage } from '../storage/image-storage';
import { VideoStorage } from '../storage/video-storage';

type Input = {
  userId: string;
  videoId: string;
};

export class ProcessVideoUseCase {
  constructor(
    private videoRepository: VideoRepository,
    private videoStorage: VideoStorage,
    private frameStorage: FrameStorage,
    private frameExtractorHandler: FrameExtractorHandler,
    private fileCompressorHandler: FileCompressorHandler,
    private videoPublisher: VideoPublisher,
  ) {}

  async execute({ videoId, userId }: Input): Promise<void> {
    logger.debug({
      message: 'Find existent video by id and user id',
      data: {
        videoId,
        userId,
      },
    });

    const video = await this.videoRepository.findByIdAndUserId(videoId, userId);

    if (!video) {
      logger.warn({
        message: 'Video not found',
        data: {
          videoId,
          userId,
        },
      });

      throw new NotFoundError('Video not found');
    }

    if (VideoStatus.PROCESSED === video.status) {
      logger.warn({
        message: 'Video already has been processed',
        data: video,
      });

      return;
    }

    video.updateStatus(VideoStatus.PROCESSING);
    await this.updateVideo(video);

    logger.debug({
      message: 'Start processing video frames',
      data: video,
    });

    const videoFile = await this.videoStorage.getByKey(video.getVideoKey());

    try {
      logger.debug('Extracting frames');

      const framesExtracted =
        await this.frameExtractorHandler.extractFromBuffer({
          video: videoFile,
        });

      logger.debug('Compressing frames');

      const framesCompressed =
        await this.fileCompressorHandler.compress(framesExtracted);

      video.setFramesKey(`frames/${userId}/${videoId}.zip`);

      logger.debug('Saving frames on storage');

      await this.frameStorage.save(video.getFramesKey(), framesCompressed);
    } catch (error) {
      logger.error({
        message: 'Error while process video frames',
        data: error,
      });

      video.updateStatus(VideoStatus.FAILED);
      await this.updateVideo(video);
      await this.publishVideo(video);

      return;
    }

    video.updateStatus(VideoStatus.PROCESSED);
    await this.updateVideo(video);
    await this.publishVideo(video);

    logger.debug({
      message: 'Video frames extracted successfully',
      data: video,
    });
  }

  private async updateVideo(video: Video): Promise<void> {
    logger.debug({
      message: 'Updating video',
      data: video,
    });

    return await this.videoRepository.update(video);
  }

  private async publishVideo(video: Video): Promise<void> {
    logger.debug({
      message: 'Publishing video',
      data: video,
    });

    return await this.videoPublisher.publish(video);
  }
}
