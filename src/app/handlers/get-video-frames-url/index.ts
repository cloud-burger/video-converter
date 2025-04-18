import { LambdaApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { env } from '~/app/env';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { GetVideoFramesUrlController } from '~/controllers/get-video-frames-url';
import { GetVideoFramesUrlUseCase } from '~/domain/use-cases/get-video-frames-url';
import { VideoRepository } from '~/infrastructure/database/video-repository';
import { FrameStorage } from '~/infrastructure/storage/frame-storage';

let pool: Pool;
let videoRepository: VideoRepository;
let frameStorage: FrameStorage;
let getVideoFramesUrlUseCase: GetVideoFramesUrlUseCase;
let getVideoFramesUrlController: GetVideoFramesUrlController;
let apiHandler: LambdaApiHandler;

const setDependencies = (connection: Connection) => {
  videoRepository = new VideoRepository(connection);
  frameStorage = new FrameStorage(env.BUCKET_NAME);
  getVideoFramesUrlUseCase = new GetVideoFramesUrlUseCase(
    videoRepository,
    frameStorage,
  );
  getVideoFramesUrlController = new GetVideoFramesUrlController(
    getVideoFramesUrlUseCase,
  );
  apiHandler = new LambdaApiHandler(getVideoFramesUrlController.handler);
};

export const handler = async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  logger.debug({
    message: 'Event received',
    data: event,
  });

  pool = await PoolFactory.getPool();
  const connection = await pool.getConnection();

  setDependencies(connection);

  try {
    return await apiHandler.handler(event);
  } finally {
    connection.release();
  }
};
