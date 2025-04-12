import { Images } from "~/domain/entities/images";
import { GetImageResponse } from "./dtos/get-image-response";

export class GetImagePresenter {
    static toHttp(images: Images): GetImageResponse {
        return {
            fileName: images.filename,
            downloadLink: images.url
        };
    }
}
