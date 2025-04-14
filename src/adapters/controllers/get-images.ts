import { Controller, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { GetImageResponse } from 'adapters/presenters/dtos/get-image-response';
import { GetImagePresenter } from 'adapters/presenters/get-image-presenter';
import { GetImagesByUserIdUseCase } from '~/domain/use-cases/get-images';

export class GetImagesByUserIdController {
  constructor(private getImagesByUserIdUseCase: GetImagesByUserIdUseCase) {}

  handler: Controller = async (
    request: any,
  ): Promise<Response<GetImageResponse>> => {
    const userId = request.headers.userid;
    const { videoId } = request.pathParameters;

    logger.info({
      message: 'Find image zip by user id',
      data: {
        request,
        userId,
      },
    });

    const image = await this.getImagesByUserIdUseCase.execute({
      userId,
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
