import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { GetImageResponse } from 'adapters/presenters/dtos/get-image-response';
import { GetImagePresenter } from 'adapters/presenters/get-image-presenter';
import { GetImagesByUserIdUseCase } from '~/domain/use-cases/get-images';

export class GetImagesByUserIdController {
  constructor(private getImagesByUserIdUseCase: GetImagesByUserIdUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<GetImageResponse>> => {
    const { user } = request;
    const { videoId } = request.pathParameters;

    logger.info({
      message: 'Find image zip by user id',
      data: {
        request,
        user,
      },
    });

    const image = await this.getImagesByUserIdUseCase.execute({
      userId: user.id,
      videoId,
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
