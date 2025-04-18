import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeVideo } from 'tests/factories/make-video';
import { ListVideosUseCase } from '~/domain/use-cases/list-videos';
import { ListVideosController } from './list-videos';

describe('Controllers - List videos', () => {
  let listVideosUseCase: MockProxy<ListVideosUseCase>;
  let listVideosController: ListVideosController;

  beforeAll(() => {
    listVideosUseCase = mock();
    listVideosController = new ListVideosController(listVideosUseCase);
  });

  it('should throw validation error when request is invalid', async () => {
    listVideosUseCase.execute.mockResolvedValue([makeVideo()]);

    try {
      await expect(
        listVideosController.handler({
          user: {
            email: 'user@gmail.com',
            id: '8336d93d-a599-4703-9a28-357e61db4dae',
          },
          params: {
            status: 'UPLOADING',
          },
        } as unknown as Request),
      ).rejects.toThrow('Invalid request data');
    } catch (error) {
      expect(error.toObject()).toEqual({
        invalidParams: [
          {
            name: 'pageSize',
            reason: 'Page size is required',
            value: undefined,
          },
          {
            name: 'pageNumber',
            reason: 'Page number is required',
            value: undefined,
          },
          {
            name: 'status',
            reason:
              'status must be one of [UPLOADED, PROCESSING, PROCESSED, FAILED, WAITING_UPLOAD]',
            value: 'UPLOADING',
          },
        ],
        reason: 'Invalid request data',
      });
    }

    expect(listVideosUseCase.execute).not.toHaveBeenCalled();
  });

  it('should list videos successfully', async () => {
    listVideosUseCase.execute.mockResolvedValue([makeVideo()]);

    const response = await listVideosController.handler({
      user: {
        email: 'user@gmail.com',
        id: '8336d93d-a599-4703-9a28-357e61db4dae',
      },
      params: {
        pageSize: '10',
        pageNumber: '1',
        status: 'UPLOADED',
      },
    } as unknown as Request);

    expect(response).toEqual({
      body: [
        {
          createdAt: '2024-10-20T00:00:00.000Z',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          status: 'UPLOADED',
          updatedAt: '2024-10-20T00:00:00.000Z',
          user: {
            email: 'user@email.com',
            id: '8336d93d-a599-4703-9a28-357e61db4dae',
          },
        },
      ],
      statusCode: 200,
    });
    expect(listVideosUseCase.execute).toHaveBeenNthCalledWith(1, {
      page: '0',
      size: '10',
      status: 'UPLOADED',
      userId: '8336d93d-a599-4703-9a28-357e61db4dae',
    });
  });
});
