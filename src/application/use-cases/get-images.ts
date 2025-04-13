import { NotFoundError } from "@cloud-burger/handlers";
import { Images } from "~/domain/entities/images";
import { ImageRepository } from "~/infrastructure/service/storage/image-repository";

interface Input {
    userId: string;
    videoId: string;
}

export class GetImagesByUserIdUseCase {
    constructor(private imageRepository: ImageRepository) {}

    async execute({ userId, videoId }: Input): Promise<Images> {
        const images = await this.imageRepository.getImagesByUserId(userId, videoId);

        if (!images) {  
            throw new NotFoundError('Image file not found');
        }

        return images;
    }
}