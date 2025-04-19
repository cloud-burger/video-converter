import * as fs from 'fs/promises';
import { FrameExtractorHandler } from './frame-extractor-handler';

jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
  readdir: jest.fn(),
  readFile: jest.fn(),
  rm: jest.fn(),
}));

type MockedFfmpeg = jest.Mocked<{
  ffprobe: jest.Mock;
  seekInput: jest.Mock;
  frames: jest.Mock;
  output: jest.Mock;
  on: jest.Mock;
  run: jest.Mock;
}>;

jest.mock('fluent-ffmpeg', () => {
  const mockFfmpegInstance = {
    seekInput: jest.fn().mockReturnThis(),
    frames: jest.fn().mockReturnThis(),
    output: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation(function (event, callback) {
      if (event === 'end') {
        setImmediate(callback); // Simula execução assíncrona
      }
      return this;
    }),
    run: jest.fn(),
  };

  const mockFfmpeg: MockedFfmpeg = jest.fn(() => mockFfmpegInstance);
  mockFfmpeg.ffprobe = jest.fn(
    (filePath: string, cb: (err: any, metadata: any) => void) => {
      cb(null, { format: { duration: 20 } });
    },
  );

  return mockFfmpeg;
});

describe('FrameExtractorHandler', () => {
  const mockVideoBuffer = Buffer.from('fake-video');
  let frameExtractor: FrameExtractorHandler;

  beforeEach(() => {
    frameExtractor = new FrameExtractorHandler();

    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.readdir as jest.Mock).mockResolvedValue(['frame-0.jpg']);
    (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('fake-frame'));
    (fs.rm as jest.Mock).mockResolvedValue(undefined);
  });

  it('should extract frames from video buffer successfully', async () => {
    const frames = await frameExtractor.extractFromBuffer({
      video: mockVideoBuffer,
    });

    expect(frames).toHaveLength(1);
    expect(frames[0]).toEqual({
      name: 'frame-0',
      content: Buffer.from('fake-frame'),
      extension: 'jpg',
    });

    expect(fs.mkdir).toHaveBeenCalledTimes(2);
    expect(fs.writeFile).toHaveBeenCalled();
    expect(fs.readdir).toHaveBeenCalled();
    expect(fs.readFile).toHaveBeenCalled();
    expect(fs.rm).toHaveBeenCalled();
  });
});
