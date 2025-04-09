import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ApiHandler } from "@cloud-burger/handlers";
import { GetImagesByUserIdUseCase } from "application/use-cases/get-images";
import { GetImagesByUserIdController } from "~/controllers/get-images";
import { ImageRepository } from "~/infrastructure/service/storage/image-repository";

let storageClient: S3Client;
let imageRepository: ImageRepository;
let getImagesByUserIdUseCase: GetImagesByUserIdUseCase;
let getImagesByUserIdController: GetImagesByUserIdController;
let apiHandler: ApiHandler;

export const handler = async (event: any) => {
    storageClient = new S3Client({ region: process.env.AWS_REGION });
    imageRepository = new ImageRepository(storageClient, process.env.BUCKET_NAME!);
    getImagesByUserIdUseCase = new GetImagesByUserIdUseCase(imageRepository);
    getImagesByUserIdController = new GetImagesByUserIdController(getImagesByUserIdUseCase);

    return getImagesByUserIdController.handler(event);
};
