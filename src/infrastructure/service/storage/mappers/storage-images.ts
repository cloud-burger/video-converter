import { Images } from "~/domain/entities/images";
import { StorageImagesSchema } from "../dtos/storage-images-schema";

export class StorageImagesMapper{
    static toDomain(storageImagesSchema: StorageImagesSchema): Images {
        return new Images({
            id: storageImagesSchema.id,
            userId: storageImagesSchema.userId,
            filename: storageImagesSchema.fileName,
            url: storageImagesSchema.downloadLink
        });
    }
}