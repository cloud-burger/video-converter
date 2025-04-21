import { sendMessage } from '@cloud-burger/aws-wrappers';
import { makeVideo } from 'tests/factories/make-video';
import { VideoPublisher } from './video-publisher';

jest.mock('@cloud-burger/aws-wrappers');

describe('Infrastructure - Publisher - Video publisher', () => {
  const sendMessageMock = jest.mocked(sendMessage);
  let videoPublisher: VideoPublisher;

  beforeAll(() => {
    videoPublisher = new VideoPublisher('video-converter-queue-url');
  });

  it('should send message successfully', async () => {
    sendMessageMock.mockResolvedValue(null);

    await videoPublisher.publish(makeVideo());

    expect(sendMessageMock).toHaveBeenNthCalledWith(1, {
      MessageBody: JSON.stringify({
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        status: 'UPLOADED',
        file: { video: 's3://video.mp4', frames: 's3://frames.zip' },
        user: {
          email: 'user@email.com',
          id: '8336d93d-a599-4703-9a28-357e61db4dae',
        },
        createdAt: '2024-10-20T00:00:00.000Z',
        updatedAt: '2024-10-20T00:00:00.000Z',
      }),
      QueueUrl: 'video-converter-queue-url',
    });
  });
});
