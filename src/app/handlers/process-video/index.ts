import { LambdaS3Handler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { S3Event } from 'aws-lambda';
import { env } from '~/app/env';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { ProcessVideoUseCase } from '~/domain/use-cases/process-video';
import { VideoRepository } from '~/infrastructure/database/video-repository';
import { FileCompressorHandler } from '~/infrastructure/file/compressor-handler';
import { FrameExtractorHandler } from '~/infrastructure/file/frame-extractor-handler';
import { VideoPublisher } from '~/infrastructure/publisher/video-publisher';
import { FrameStorage } from '~/infrastructure/storage/frame-storage';
import { VideoStorage } from '~/infrastructure/storage/video-storage';
import { ProcessVideoWorker } from '~/workers/process-video';

let pool: Pool;
let videoRepository: VideoRepository;
let videoStorage: VideoStorage;
let frameStorage: FrameStorage;
let frameExtractorHandler: FrameExtractorHandler;
let fileCompressorHandler: FileCompressorHandler;
let videoPublisher: VideoPublisher;
let processVideoUseCase: ProcessVideoUseCase;
let processVideoWorker: ProcessVideoWorker;
let s3Handler: LambdaS3Handler;

const setDependencies = (connection: Connection) => {
  videoRepository = new VideoRepository(connection);
  videoStorage = new VideoStorage(env.BUCKET_NAME);
  frameStorage = new FrameStorage(env.BUCKET_NAME);
  frameExtractorHandler = new FrameExtractorHandler();
  fileCompressorHandler = new FileCompressorHandler();
  videoPublisher = new VideoPublisher(env.VIDEO_QUEUE_URL);
  processVideoUseCase = new ProcessVideoUseCase(
    videoRepository,
    videoStorage,
    frameStorage,
    frameExtractorHandler,
    fileCompressorHandler,
    videoPublisher,
  );
  processVideoWorker = new ProcessVideoWorker(processVideoUseCase);
  s3Handler = new LambdaS3Handler(processVideoWorker.handler);
};

export const handler = async (event: S3Event): Promise<void> => {
  logger.debug({
    message: 'Event received',
    data: event,
  });

  pool = await PoolFactory.getPool();
  const connection = await pool.getConnection();

  setDependencies(connection);

  try {
    return await s3Handler.handler(event);
  } finally {
    connection.release();
  }
};
