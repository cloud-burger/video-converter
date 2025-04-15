import { VideoStatus } from '~/domain/entities/enums/video-status';
import { Video } from '~/domain/entities/video';

export const makeVideo = (override: Partial<Video> = {}): Video =>
  new Video({
    id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    status: VideoStatus.UPLOADED,
    file: {
      video: 's3://video.mp4',
      frames: 's3://frames.zip',
    },
    user: {
      email: 'user@email.com',
      id: '8336d93d-a599-4703-9a28-357e61db4dae',
    },
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-20'),
    ...override,
  });
