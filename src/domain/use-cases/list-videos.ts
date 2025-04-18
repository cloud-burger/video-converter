import { VideoStatus } from '../entities/enums/video-status';
import { Video } from '../entities/video';
import { VideoRepository } from '../repositories/video';

type Input = {
  page: string;
  size: string;
  userId: string;
  status?: VideoStatus;
};

export class ListVideosUseCase {
  constructor(private videoRepository: VideoRepository) {}

  async execute(input: Input): Promise<Video[]> {
    return this.videoRepository.findMany(input);
  }
}
