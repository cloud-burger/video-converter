import { BadRequestError, NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { VideoStatus } from '../entities/enums/video-status';
import { VideoRepository } from '../repositories/video';
import { FrameStorage } from '../storage/image-storage';

interface Input {
  userId: string;
  videoId: string;
}

export class GetVideoFramesUrlUseCase {
  constructor(
    private videoRepository: VideoRepository,
    private frameStorage: FrameStorage,
  ) {}

  async execute({ userId, videoId }: Input): Promise<string> {
    const video = await this.videoRepository.findByIdAndUserId(videoId, userId);

    if (!video) {
      logger.warn({
        message: 'Video not found',
        data: {
          userId,
          videoId,
        },
      });

      throw new NotFoundError('Video not found');
    }

    if (VideoStatus.PROCESSED !== video.status) {
      logger.warn({
        message: 'Video frames not processed',
        data: {
          userId,
          videoId,
        },
      });

      throw new BadRequestError('Video frames not processed');
    }

    if (!video.getFramesKey()) {
      logger.warn({
        message: 'Video frames url are not available',
        data: {
          userId,
          videoId,
        },
      });

      throw new NotFoundError('Video frames url are not available');
    }

    return await this.frameStorage.getUrlByKey(video.getFramesKey());
  }
}
