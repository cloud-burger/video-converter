import { mock, MockProxy } from 'jest-mock-extended';
import { ProcessVideoUseCase } from '~/domain/use-cases/process-video';
import { ProcessVideoWorker } from './process-video';

describe('Workers - Process video', () => {
  let processVideoUseCase: MockProxy<ProcessVideoUseCase>;
  let processVideoWorker: ProcessVideoWorker;

  beforeAll(() => {
    processVideoUseCase = mock();
    processVideoWorker = new ProcessVideoWorker(processVideoUseCase);
  });

  it('should process video successfully', async () => {
    processVideoUseCase.execute.mockResolvedValue();

    await processVideoWorker.handler([
      {
          bucket: 'video-converter-bucket',
          eventName: 'create-object',
          eventTime: '2025-02-10',
          key: 'videos/f4746383-942d-4211-96bd-56c78b8da4b0/3082e467-edef-46b0-8acd-660a47be259a.mp4',
          raw: {},
        } as any, // Cast to 'any' to bypass type checking
    ]);

    expect(processVideoUseCase.execute).toHaveBeenNthCalledWith(1, {
      userId: 'f4746383-942d-4211-96bd-56c78b8da4b0',
      videoId: '3082e467-edef-46b0-8acd-660a47be259a',
    });
  });
});
