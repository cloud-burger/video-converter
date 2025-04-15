import { LambdaApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { env } from 'app/env';
import Connection from 'app/postgres/connection';
import Pool from 'app/postgres/pool';
import { PoolFactory } from 'app/postgres/pool-factory';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetVideoUrlController } from '~/controllers/get-video-url';
import { GetVideoUrlUseCase } from '~/domain/use-cases/get-video-url';
import { VideoRepository } from '~/infrastructure/database/video-repository';
import { VideoStorage } from '~/infrastructure/storage/video-storage';

let pool: Pool;
let videoRepository: VideoRepository;
let videoStorage: VideoStorage;
let getVideoUrlUseCase: GetVideoUrlUseCase;
let getVideoUrlController: GetVideoUrlController;
let apiHandler: LambdaApiHandler;

const setDependencies = (connection: Connection) => {
  videoRepository = new VideoRepository(connection);
  videoStorage = new VideoStorage(env.BUCKET_NAME);
  getVideoUrlUseCase = new GetVideoUrlUseCase(videoRepository, videoStorage);
  getVideoUrlController = new GetVideoUrlController(getVideoUrlUseCase);
  apiHandler = new LambdaApiHandler(getVideoUrlController.handler);
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
