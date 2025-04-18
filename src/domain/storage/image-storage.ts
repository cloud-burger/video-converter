export interface FrameStorage {
  getUrlByKey(key: string): Promise<string>;
  save(id: string, file: Buffer): Promise<void>;
}
