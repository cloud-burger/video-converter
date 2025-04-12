import logger from '@cloud-burger/logger';
import { Storage as IStorage } from "~/domain/repositories/storage";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Video } from '~/domain/entities/video';
import { StorageVideoMapper } from './mappers/storage-video';
import { StorageVideoSchema } from './dtos/storage-video-schema';
import { VideoStatus } from '~/domain/entities/enums/video-status';

const EXPIRES_IN = 3600;

export class VideoRepository {
    constructor(private storageClient: S3Client, private bucketName: string) {}

    async getVideoUploadByUserId(userId: string, fileName: string): Promise<Video | null> {
        const objectKey = userId + '/videos/' + fileName;

        try {
            await this.storageClient.send(new HeadObjectCommand({ Bucket: this.bucketName, Key: objectKey }));

            const command = new PutObjectCommand({ Bucket: this.bucketName, Key: objectKey });
            const presignedUrl = await getSignedUrl(this.storageClient, command, { expiresIn: EXPIRES_IN });

            const storageData = {
                id: userId,
                userId: userId,
                fileName: fileName,
                uploadLink: presignedUrl,
                status: VideoStatus.PENDING_UPLOADED
            };

            logger.debug({
                message: 'Video repository data',
                data: {
                    storageData
                }
            });

            return StorageVideoMapper.toDomain(storageData as StorageVideoSchema);
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