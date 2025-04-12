import { NotFoundError } from "@cloud-burger/handlers";
import { Video } from "~/domain/entities/video";
import { VideoRepository } from "~/infrastructure/service/storage/video-repository";

interface Input {
    userId: string;
    fileName: string;
}

export class GetVideoUploadByUserIdUseCase {
    constructor(private videoRepository: VideoRepository) {}

    async execute({ userId, fileName }: Input): Promise<Video> {
        const video = await this.videoRepository.getVideoUploadByUserId(userId, fileName);

        if (!video) {  
            throw new NotFoundError('Video upload failed');
        }

        return video;
    }
}