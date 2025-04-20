import { S3Message, S3Worker } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { ProcessVideoUseCase } from '~/domain/use-cases/process-video';
export class ProcessVideoWorker {
  constructor(private processVideoUseCase: ProcessVideoUseCase) {}

  handler: S3Worker = async (messages: S3Message[]) => {
    await Promise.all(
      messages.map(async (message) => {
        logger.info({
          message: 'Process video request',
          data: message,
        });

        const { userId, videoId } = this.extractUserInfos(message.key);

        await this.processVideoUseCase.execute({
          userId,
          videoId,
        });

        logger.info({
          message: 'Process video response',
        });
      }),
    );
  };

  private extractUserInfos(key: string) {
    const parts = key.split('/');

    return {
      userId: parts[1],
      videoId: parts[2].replace('.mp4', ''),
    };
  }
}
