import { removeNullValues } from '~/controllers/helpers/remove-null-values';
import { GetVideoFramesUrlResponse } from './dtos/get-video-frames-url-response';

export class GetVideoFramesUrlPresenter {
  static toHttp(url: string): GetVideoFramesUrlResponse {
    return removeNullValues({
      url,
    });
  }
}
