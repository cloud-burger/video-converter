import { GetImageResponse } from "./dtos/get-image-response";

export class GetImagePresenter {
    //TODO: Substituir tipo string do parâmetro recebido pela classe 
    static toHttp(image: string): GetImageResponse {
        return {
            url: image
        };
    }
}
