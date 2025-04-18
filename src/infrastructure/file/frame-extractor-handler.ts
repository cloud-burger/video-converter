export interface ExtractFramesFromBufferInput {
  video: Buffer;
}

export interface ExtractedFrame {
  name: string;
  content: Buffer;
  extension: string;
}

export class FrameExtractorHandler {
  async extractFromBuffer({
    video,
  }: ExtractFramesFromBufferInput): Promise<ExtractedFrame[]> {
    throw new Error('Method not implemented');
  }
}
