import { GetImagesByUserIdUseCase } from "application/use-cases/get-images";
import { Controller, Request, Response } from '@cloud-burger/handlers';
import { GetImageResponse } from "adapters/presenters/dtos/get-image-response";
import logger from '@cloud-burger/logger';
import { GetImagePresenter } from "adapters/presenters/get-image-presenter";

export class GetImagesByUserIdController {
    constructor(
        private getImagesByUserIdUseCase: GetImagesByUserIdUseCase,
    ) { }

    handler: Controller = async (
        request: any,
    ): Promise<Response<GetImageResponse>> => {
        const userId = request.headers.userid;
        const { videoId } = request.pathParameters;

        logger.info({
            message: 'Find image zip by user id',
            data: {
                request,
                userId
            }
        });

        const image = await this.getImagesByUserIdUseCase.execute({
            userId,
            videoId
        });

        logger.info({
            message: 'Find image zip by user id',
            data: image,
        });

        return {
            statusCode: 200,
            body: GetImagePresenter.toHttp(image),
        };
    };
}