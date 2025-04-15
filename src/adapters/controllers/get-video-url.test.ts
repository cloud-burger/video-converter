import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { GetVideoUrlUseCase } from '~/domain/use-cases/get-video-url';
import { GetVideoUrlController } from './get-video-url';

describe('Controllers - Get video url', () => {
  let getVideoUrlUseCase: MockProxy<GetVideoUrlUseCase>;
  let getVideoUrlController: GetVideoUrlController;

  beforeAll(() => {
    getVideoUrlUseCase = mock();
    getVideoUrlController = new GetVideoUrlController(getVideoUrlUseCase);
  });

  it('should get video url successfully', async () => {
    getVideoUrlUseCase.execute.mockResolvedValue('https://s3.upload.com.br');

    const response = await getVideoUrlController.handler({
      user: {
        id: '8336d93d-a599-4703-9a28-357e61db4dae',
        email: 'user@email.com',
      },
    } as unknown as Request);

    expect(response).toEqual({
      statusCode: 200,
      body: {
        url: 'https://s3.upload.com.br',
      },
    });
    expect(getVideoUrlUseCase.execute).toHaveBeenNthCalledWith(1, {
      user: {
        email: 'user@email.com',
        id: '8336d93d-a599-4703-9a28-357e61db4dae',
      },
    });
  });
});
