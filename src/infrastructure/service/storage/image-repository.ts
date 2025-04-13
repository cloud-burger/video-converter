import logger from '@cloud-burger/logger';
import { Storage as IStorage } from "~/domain/repositories/storage";
import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Images } from '~/domain/entities/images';
import { StorageImagesMapper } from './mappers/storage-images';
import { StorageImagesSchema } from './dtos/storage-images-schema';

const EXPIRES_IN = 3600;

export class ImageRepository implements IStorage {
    constructor(private storageClient: S3Client, private bucketName: string) {}

    async getImagesByUserId(userId: string, fileName: string): Promise<Images | null> {
        const objectKey = userId + '/images/' + fileName + '.zip';

        try {
            await this.storageClient.send(new HeadObjectCommand({ Bucket: this.bucketName, Key: objectKey }));

            const command = new GetObjectCommand({ Bucket: this.bucketName, Key: objectKey });
            const presignedUrl = await getSignedUrl(this.storageClient, command, { expiresIn: EXPIRES_IN });

            const storageData = {
                id: userId,
                userId: userId,
                fileName: 'diagnostic',
                downloadLink: presignedUrl
            };

            logger.debug({
                message: 'Image repository data',
                data: {
                    storageData
                }
            });

            return StorageImagesMapper.toDomain(storageData as StorageImagesSchema);
        } catch (error: any) {
            logger.debug({
                message: 'Image object not found',
                data: {
                    error                    
                }
            });

            return null;
        }
    }
}