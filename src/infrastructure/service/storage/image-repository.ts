import logger from '@cloud-burger/logger';
import { Storage as IStorage } from "~/domain/repositories/storage";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class ImageRepository implements IStorage {
    //TODO: Validar se recebo direto o S3Client ou uma classe genérica, tipo a Connection "StorageClient"
    constructor(private storageClient: S3Client, private bucketName: string) {}

    async getImagesByUserId(userId: string): Promise<string | null> {
        const objectKey = userId + '/processed/diagnostic.zip';
        const command = new GetObjectCommand({ Bucket: this.bucketName, Key: objectKey });
        //TODO: ExpiresIn precisa estar em uma constante
        const presignedUrl = await getSignedUrl(this.storageClient, command, { expiresIn: 3600 });

        // if (!presignedUrl.length) {
            logger.debug({
                message: 'Image object not found',
                data: {
                    userId,
                    presignedUrl
                },
            });
        
            // return null;
        // }
        
        //TODO: Retornar um mapper toDomain
        return presignedUrl;
    }
}