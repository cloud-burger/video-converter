import { LambdaApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { ListVideosController } from '~/controllers/list-videos';
import { ListVideosUseCase } from '~/domain/use-cases/list-videos';
import { VideoRepository } from '~/infrastructure/database/video-repository';

let pool: Pool;
let videoRepository: VideoRepository;
let listVideosUseCase: ListVideosUseCase;
let listVideosController: ListVideosController;
let apiHandler: LambdaApiHandler;

const setDependencies = (connection: Connection) => {
  videoRepository = new VideoRepository(connection);
  listVideosUseCase = new ListVideosUseCase(videoRepository);
  listVideosController = new ListVideosController(listVideosUseCase);
  apiHandler = new LambdaApiHandler(listVideosController.handler);
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
