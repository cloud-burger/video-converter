import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { GetVideoFramesUrlUseCase } from '~/domain/use-cases/get-video-frames-url';
import { GetVideoFramesUrlController } from './get-video-frames-url';

describe('Controllers - Get video frames url', () => {
  let getVideoFramesUrlUseCase: MockProxy<GetVideoFramesUrlUseCase>;
  let getVideoFramesUrlController: GetVideoFramesUrlController;

  beforeAll(() => {
    getVideoFramesUrlUseCase = mock();
    getVideoFramesUrlController = new GetVideoFramesUrlController(
      getVideoFramesUrlUseCase,
    );
  });

  it('should get video frames url successfully', async () => {
    getVideoFramesUrlUseCase.execute.mockResolvedValue(
      'https://s3.download.com.br',
    );

    const response = await getVideoFramesUrlController.handler({
      user: {
        id: '8336d93d-a599-4703-9a28-357e61db4dae',
        email: 'user@email.com',
      },
      pathParameters: {
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      },
    } as unknown as Request);

    expect(response).toEqual({
      statusCode: 200,
      body: {
        url: 'https://s3.download.com.br',
      },
    });
    expect(getVideoFramesUrlUseCase.execute).toHaveBeenNthCalledWith(1, {
      userId: '8336d93d-a599-4703-9a28-357e61db4dae',
      videoId: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    });
  });
});
