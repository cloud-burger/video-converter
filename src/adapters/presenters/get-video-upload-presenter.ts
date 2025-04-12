import { Video } from "~/domain/entities/video";
import { GetVideoUploadResponse } from "./dtos/get-video-upload-response";

export class GetVideoUploadPresenter {
    static toHttp(video: Video): GetVideoUploadResponse {
        return {
            fileName: video.filename,
            uploadLink: video.url.video
        };
    }
}
