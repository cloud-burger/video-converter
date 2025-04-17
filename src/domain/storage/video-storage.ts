export interface VideoStorage {
  getUrlByKey(key: string): Promise<string>;
  getByKey(key: string): Promise<Buffer>;
}
