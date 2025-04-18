import Connection from 'app/postgres/connection';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeVideo } from 'tests/factories/make-video';
import { VideoStatus } from '~/domain/entities/enums/video-status';
import { VideoRepository } from './video-repository';

describe('Infrastructure - Database - Video Repository', () => {
  let connection: MockProxy<Connection>;
  let videoRepository: VideoRepository;

  beforeAll(() => {
    connection = mock();
    videoRepository = new VideoRepository(connection);
  });

  it('should create video successfully', async () => {
    connection.query.mockResolvedValue({
      records: [],
    });

    await videoRepository.save(makeVideo());

    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: {
        created_at: '2024-10-20T00:00:00.000Z',
        file_frames_key: 's3://frames.zip',
        file_key: 's3://video.mp4',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        status: 'UPLOADED',
        updated_at: '2024-10-20T00:00:00.000Z',
        user_email: 'user@email.com',
        user_id: '8336d93d-a599-4703-9a28-357e61db4dae',
      },
      sql: 'INSERT INTO public.videos (id,user_id,user_email,status,file_key,file_frames_key,created_at,updated_at) VALUES (:id,:user_id,:user_email,:status,:file_key,:file_frames_key,:created_at,:updated_at)',
    });
  });

  it('should return null when find video by id and user id and video does not exists', async () => {
    connection.query.mockResolvedValue({
      records: [],
    });

    const video = await videoRepository.findByIdAndUserId(
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      '8336d93d-a599-4703-9a28-357e61db4dae',
    );

    expect(video).toBeNull();
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: {
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        userId: '8336d93d-a599-4703-9a28-357e61db4dae',
      },
      sql: 'SELECT * FROM public.videos WHERE id=:id and user_id=:userId',
    });
  });

  it('should find video by id and user id successfully', async () => {
    connection.query.mockResolvedValue({
      records: [
        {
          created_at: '2024-10-20T00:00:00.000Z',
          file_frames_key: 's3://frames.zip',
          file_key: 's3://video.mp4',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          status: 'UPLOADED',
          updated_at: '2024-10-20T00:00:00.000Z',
          user_email: 'user@email.com',
          user_id: '8336d93d-a599-4703-9a28-357e61db4dae',
        },
      ],
    });

    const video = await videoRepository.findByIdAndUserId(
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      '8336d93d-a599-4703-9a28-357e61db4dae',
    );

    expect(video).toEqual({
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
    });
    expect(connection.query).toHaveBeenNthCalledWith(1, {
      parameters: {
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        userId: '8336d93d-a599-4703-9a28-357e61db4dae',
      },
      sql: 'SELECT * FROM public.videos WHERE id=:id and user_id=:userId',
    });
  });
});
