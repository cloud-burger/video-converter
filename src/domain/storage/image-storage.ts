export interface ImageStorage {
  findById(id: string): Promise<Buffer | null>;
  getUrlById(id: string, expiresIn?: number): Promise<string>;
  save(id: string, file: Buffer): Promise<void>;
}
