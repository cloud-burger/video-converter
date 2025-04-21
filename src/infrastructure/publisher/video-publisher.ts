import { sendMessage } from '@cloud-burger/aws-wrappers';
import { Video } from '~/domain/entities/video';
import { VideoPublisher as IVideoPublisher } from '~/domain/publisher/video-publisher';

export class VideoPublisher implements IVideoPublisher {
  constructor(private videoQueueUrl: string) {}

  async publish(video: Video): Promise<void> {
    await sendMessage({
      QueueUrl: this.videoQueueUrl,
      MessageBody: JSON.stringify(video),
    });
  }
}
