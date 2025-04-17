import { removeNullValues } from '~/controllers/helpers/remove-null-values';
import { GetVideoUrlResponse } from './dtos/get-video-url-response';

export class GetVideoUrlPresenter {
  static toHttp(url: string): GetVideoUrlResponse {
    return removeNullValues({
      url,
    });
  }
}
