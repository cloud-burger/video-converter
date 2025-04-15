import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { GetVideoUrlResponse } from 'adapters/presenters/dtos/get-video-url-response';
import { GetVideoUrlPresenter } from 'adapters/presenters/get-video-url-presenter';
import { GetVideoUrlUseCase } from '~/domain/use-cases/get-video-url';

export class GetVideoUrlController {
  constructor(private getVideoUrlUseCase: GetVideoUrlUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<GetVideoUrlResponse>> => {
    const { user } = request;

    logger.info({
      message: 'Get video url request',
      data: request,
    });

    const url = await this.getVideoUrlUseCase.execute({
      user: {
        id: user.id,
        email: user.email,
      },
    });

    logger.info({
      message: 'Get video url response',
      data: url,
    });

    return {
      statusCode: 200,
      body: GetVideoUrlPresenter.toHttp(url),
    };
  };
}
