import { Video } from '../entities/video';

export interface VideoUpload {
  create(video: Video): Promise<void>;
  findById(id: string): Promise<Video | null>;
  findManyByUserId(userId: string): Promise<Video[]>;
}
