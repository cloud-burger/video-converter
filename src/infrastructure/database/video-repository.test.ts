import Connection from 'app/postgres/connection';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeVideo } from 'tests/factories/make-video';
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
});
