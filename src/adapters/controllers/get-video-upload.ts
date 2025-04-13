import { GetVideoUploadByUserIdUseCase } from "application/use-cases/get-video-upload";
import { Controller, Request, Response } from '@cloud-burger/handlers';
import { GetVideoUploadResponse } from "adapters/presenters/dtos/get-video-upload-response";
import logger from '@cloud-burger/logger';
import { GetVideoUploadPresenter } from "adapters/presenters/get-video-upload-presenter";

export class GetVideoUploadByUserIdController {
    constructor(
        private getVideoUploadByUserIdUseCase: GetVideoUploadByUserIdUseCase,
    ) { }

    handler: Controller = async (
        request: any,
    ): Promise<Response<GetVideoUploadResponse>> => {
        const userId = request.headers.userid;
        const { fileName } = request.pathParameters;

        logger.info({
            message: 'Get video upload URL by user id',
            data: {
                request,
                userId
            }
        });

        const video = await this.getVideoUploadByUserIdUseCase.execute({
            userId,
            fileName
        });

        logger.info({
            message: 'Get video upload URL by user id',
            data: video,
        });

        return {
            statusCode: 200,
            body: GetVideoUploadPresenter.toHttp(video),
        };
    };
}