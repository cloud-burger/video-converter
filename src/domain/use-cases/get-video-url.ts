import { randomUUID } from 'crypto';
import { Video } from '../entities/video';
import { VideoRepository } from '../repositories/video';
import { VideoStorage } from '../storage/video-storage';

type Input = {
  user: {
    id: string;
    email: string;
  };
};

export class GetVideoUrlUseCase {
  constructor(
    private videoRepository: VideoRepository,
    private videoStorage: VideoStorage,
  ) {}

  async execute(input: Input): Promise<string> {
    const { user } = input;

    const id = randomUUID();

    const video = new Video({
      id,
      user: input.user,
      file: {
        video: `videos/${user.id}/${id}.mp4`,
      },
    });

    const url = await this.videoStorage.getUrlByKey(video.getVideoKey());

    await this.videoRepository.save(video);

    return url;
  }
}
