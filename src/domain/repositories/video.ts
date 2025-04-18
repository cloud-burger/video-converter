import { Video } from '../entities/video';

export interface VideoPaginationParams {
  page: string;
  size: string;
  userId: string;
  status?: string;
}

export interface VideoRepository {
  save(video: Video): Promise<void>;
  findByIdAndUserId(id: string, userId: string): Promise<Video | null>;
  findMany(input: VideoPaginationParams): Promise<Video[]>;
}
