import { Url } from '~/domain/entities/value-objects/url';
import { User } from '~/domain/entities/value-objects/user';
import { Video } from "~/domain/entities/video";
import { StorageVideoSchema } from "../dtos/storage-video-schema";
import { VideoStatus } from '~/domain/entities/enums/video-status';

export class StorageVideoMapper {
    static toDomain(storageVideoSchema: StorageVideoSchema): Video {
        const user: User = {
            id: storageVideoSchema.userId,
            email: ''
        };

        const url: Url = {
            video: storageVideoSchema.uploadLink
        };

        return new Video({
            id: storageVideoSchema.id,
            user: user,
            filename: storageVideoSchema.fileName,
            url: url,
            status: VideoStatus[storageVideoSchema.status as keyof typeof VideoStatus]
        });
    }
}