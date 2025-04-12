import { S3Client } from "@aws-sdk/client-s3";
import { LambdaApiHandler } from "@cloud-burger/handlers";
import { GetVideoUploadByUserIdUseCase } from "application/use-cases/get-video-upload";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GetVideoUploadByUserIdController } from "~/controllers/get-video-upload";
import { VideoRepository } from "~/infrastructure/service/storage/video-repository";

let videoRepository: VideoRepository;
let getVideoUploadByUserIdUseCase: GetVideoUploadByUserIdUseCase;
let getVideoUploadByUserIdController: GetVideoUploadByUserIdController;
let lambdaApiHandler: LambdaApiHandler;

const setDependencies = (storageClient: S3Client) => {
    videoRepository = new VideoRepository(storageClient, process.env.BUCKET_NAME!);
    getVideoUploadByUserIdUseCase = new GetVideoUploadByUserIdUseCase(videoRepository);
    getVideoUploadByUserIdController = new GetVideoUploadByUserIdController(getVideoUploadByUserIdUseCase);

    lambdaApiHandler = new LambdaApiHandler(getVideoUploadByUserIdController.handler)
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const storageClient = new S3Client({ region: process.env.AWS_REGION });

    setDependencies(storageClient);

    return await lambdaApiHandler.handler(event);
};
