import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { VideoResponse } from 'adapters/presenters/dtos/video-presenter';
import { ListVideosPresenter } from 'adapters/presenters/list-videos-presenter';
import { ListVideosUseCase } from '~/domain/use-cases/list-videos';
import { listVideosSchema } from './validations/list-orders-schema';

export class ListVideosController {
  constructor(private listVideosUseCase: ListVideosUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<VideoResponse[]>> => {
    const { user } = request;
    logger.info({
      message: 'List videos request',
      data: request,
    });

    const { data, errors } = validateSchema(listVideosSchema, {
      ...request.params,
    });

    const hasValidationErrors = errors && errors.length;

    if (hasValidationErrors) {
      logger.warn({
        message: 'List videos validation error',
        data: errors,
      });

      throw new ValidationError('Invalid request data', errors);
    }

    const videos = await this.listVideosUseCase.execute({
      page: String(data.pageNumber - 1),
      size: String(data.pageSize),
      userId: user.id,
      status: data.status,
    });

    logger.info({
      message: 'List videos response',
      data: videos,
    });

    return {
      statusCode: 200,
      body: ListVideosPresenter.toHttp(videos),
    };
  };
}
