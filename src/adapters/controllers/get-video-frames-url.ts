import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { GetVideoFramesUrlResponse } from 'adapters/presenters/dtos/get-video-frames-url-response';
import { GetVideoFramesUrlPresenter } from 'adapters/presenters/get-video-frames-url-presenter';
import { GetVideoFramesUrlUseCase } from '~/domain/use-cases/get-video-frames-url';

export class GetVideoFramesUrlController {
  constructor(private getVideoFramesUrlUseCase: GetVideoFramesUrlUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<GetVideoFramesUrlResponse>> => {
    const { user } = request;
    const { id } = request.pathParameters;

    logger.info({
      message: 'Get video frames url request',
      data: {
        request,
        user,
      },
    });

    const image = await this.getVideoFramesUrlUseCase.execute({
      userId: user.id,
      videoId: id,
    });

    logger.info({
      message: 'Get video frames url response',
      data: image,
    });

    return {
      statusCode: 200,
      body: GetVideoFramesUrlPresenter.toHttp(image),
    };
  };
}
