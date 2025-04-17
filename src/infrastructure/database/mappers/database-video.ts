import { VideoStatus } from '~/domain/entities/enums/video-status';
import { Video } from '~/domain/entities/video';
import { VideoDatabaseSchema } from '../dtos/video-database-schema';

export class DatabaseVideoMapper {
  static toDatabase(video: Video): VideoDatabaseSchema {
    return {
      id: video.id,
      user_id: video.user.id,
      user_email: video.user.email,
      status: video.status,
      file_key: video.file.video,
      file_frames_key: video.file.frames ?? null,
      created_at: video.createdAt.toISOString(),
      updated_at: video.updatedAt.toISOString(),
    };
  }

  static toDomain(videoDatabase: VideoDatabaseSchema): Video {
    return new Video({
      id: videoDatabase.id,
      user: {
        email: videoDatabase.user_email,
        id: videoDatabase.user_id,
      },
      file: {
        video: videoDatabase.file_key,
        frames: videoDatabase.file_frames_key,
      },
      status: videoDatabase.status as VideoStatus,
      createdAt: new Date(videoDatabase.created_at),
      updatedAt: new Date(videoDatabase.updated_at),
    });
  }
}
