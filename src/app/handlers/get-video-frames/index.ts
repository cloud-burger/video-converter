import { S3Client } from '@aws-sdk/client-s3';
import { LambdaApiHandler } from '@cloud-burger/handlers';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetImagesByUserIdController } from '~/controllers/get-images';
import { GetImagesByUserIdUseCase } from '~/domain/use-cases/get-images';
import { ImageRepository } from '~/infrastructure/service/storage/image-repository';

let imageRepository: ImageRepository;
let getImagesByUserIdUseCase: GetImagesByUserIdUseCase;
let getImagesByUserIdController: GetImagesByUserIdController;
let lambdaApiHandler: LambdaApiHandler;

const setDependencies = (storageClient: S3Client) => {
  imageRepository = new ImageRepository(storageClient, process.env.BUCKET_NAME);
  getImagesByUserIdUseCase = new GetImagesByUserIdUseCase(imageRepository);
  getImagesByUserIdController = new GetImagesByUserIdController(
    getImagesByUserIdUseCase,
  );

  lambdaApiHandler = new LambdaApiHandler(getImagesByUserIdController.handler);
};

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const storageClient = new S3Client({ region: process.env.AWS_REGION });

  setDependencies(storageClient);

  return await lambdaApiHandler.handler(event);
};
