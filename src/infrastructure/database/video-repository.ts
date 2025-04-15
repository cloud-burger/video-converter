import Connection from 'app/postgres/connection';
import { Video } from '~/domain/entities/video';
import { VideoRepository as IVideoRepository } from '~/domain/repositories/video';
import { DatabaseVideoMapper } from './mappers/database-video';
import { INSERT_VIDEO } from './queries/insert-video';

export class VideoRepository implements IVideoRepository {
  constructor(private connection: Connection) {}

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

  findById(id: string): Promise<Video | null> {
    throw new Error('Method not implemented.');
  }
  findManyByUserId(userId: string): Promise<Video[]> {
    throw new Error('Method not implemented.');
  }
}
