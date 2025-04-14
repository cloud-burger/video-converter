export interface VideoStorage {
  getUrl(): Promise<string>;
  save(id: string, file: Buffer): Promise<void>;
}
