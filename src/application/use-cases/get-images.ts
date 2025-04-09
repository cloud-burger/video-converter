import { ImageRepository } from "~/infrastructure/service/storage/image-repository";

interface Input {
    userId: string;
}

export class GetImagesByUserIdUseCase {
    constructor(private imageRepository: ImageRepository) {}

    //TODO: Retornar uma classe entity em vez de string
    async execute({ userId }: Input): Promise<string> {
        const images = await this.imageRepository.getImagesByUserId(userId);

        //TODO: Implementar tratamento quando não encontra arquivo

        return images;
    }
}