import { Video } from '../entities/video';

export interface VideoPublisher {
  publish(video: Video): Promise<void>;
}
