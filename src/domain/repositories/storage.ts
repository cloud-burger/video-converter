
export interface Storage {
  getImagesByUserId(userId: string): Promise<string>;
}
