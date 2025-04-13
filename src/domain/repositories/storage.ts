import { Images } from "../entities/images";

export interface Storage {
  getImagesByUserId(userId: string, fileName: string): Promise<Images | null>;
}
