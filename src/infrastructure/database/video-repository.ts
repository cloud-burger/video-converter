import Connection from 'app/postgres/connection';
import { Video } from '~/domain/entities/video';
import { VideoRepository as IVideoRepository } from '~/domain/repositories/video';
import { VideoDatabaseSchema } from './dtos/video-database-schema';
import { DatabaseVideoMapper } from './mappers/database-video';
import { FIND_VIDEO_BY_ID_AND_USER_ID } from './queries/find-video-by-id-and-user-id';
import { INSERT_VIDEO } from './queries/insert-video';

export class VideoRepository implements IVideoRepository {
  constructor(private connection: Connection) {}

  async findByIdAndUserId(id: string, userId: string): Promise<Video | null> {
    const { records } = await this.connection.query({
      sql: FIND_VIDEO_BY_ID_AND_USER_ID,
      parameters: {
        id,
        userId,
      },
    });

    if (!records.length) {
      return null;
    }

    const [videoDbSchema] = records;

    return DatabaseVideoMapper.toDomain(videoDbSchema as VideoDatabaseSchema);
  }

  async save(video: Video): Promise<void> {
    const recordToSave = DatabaseVideoMapper.toDatabase(video);

    const columns = Object.keys(recordToSave)
      .filter(
        (key) => recordToSave[key] !== undefined && recordToSave[key] !== null,
      )
      .map((key) => {
        return key;
      });

    const parameters = columns.map((key) => {
      return `:${key}`;
    });

    await this.connection.query({
      sql: INSERT_VIDEO(columns.join(), parameters.join()),
      parameters: recordToSave,
    });
  }

  findManyByUserId(userId: string): Promise<Video[]> {
    throw new Error('Method not implemented.');
  }
}
