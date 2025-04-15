import { Video } from '../entities/video';

export interface VideoRepository {
  save(video: Video): Promise<void>;
  findByIdAndUserId(id: string, userId: string): Promise<Video | null>;
  findManyByUserId(userId: string): Promise<Video[]>;
}
