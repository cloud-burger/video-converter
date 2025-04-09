import { GetImagesByUserIdUseCase } from "application/use-cases/get-images";
import { Controller, Request, Response } from '@cloud-burger/handlers';
import { GetImageResponse } from "adapters/presenters/dtos/get-image-response";
import logger from '@cloud-burger/logger';
import { GetImagePresenter } from "adapters/presenters/get-image-presenter";

export class GetImagesByUserIdController {
    constructor(
      private getImagesByUserIdUseCase: GetImagesByUserIdUseCase,
    ) {}
    
    //TODO: Ajustar para Response<GetImageResponse>,  ajustar também o tipo do request
    handler: Controller = async (
      request: any,
    ): Promise<Response<string>> => {
      const { userId } = request.pathParameters;
  
      logger.info({
        message: 'Find image zip by user id',
        data: request,
      });
  
      const image = await this.getImagesByUserIdUseCase.execute({
        userId,
      });
  
      logger.info({
        message: 'Find image zip by user id',
        data: image,
      });
  
      return {
        statusCode: 200,
        body: JSON.stringify(GetImagePresenter.toHttp(image)),
      };
    };
  }