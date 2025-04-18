import { removeNullValues } from '~/controllers/helpers/remove-null-values';
import { Video } from '~/domain/entities/video';
import { VideoResponse } from './dtos/video-presenter';

export class ListVideosPresenter {
  static toHttp(videos: Video[]): VideoResponse[] {
    return videos.map((video) => {
      return removeNullValues({
        id: video.id,
        user: video.user,
        status: video.status,
        createdAt: video.createdAt.toISOString(),
        updatedAt: video.updatedAt.toISOString(),
      });
    });
  }
}
