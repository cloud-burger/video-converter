import Ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import * as fs from 'fs/promises';
import { FrameExtractorHandler } from './frame-extractor-handler';

jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
  readdir: jest.fn(),
  readFile: jest.fn(),
  rm: jest.fn(),
}));

jest.mock('fluent-ffmpeg', () => {
  const mockFfmpegInstance = {
    seekInput: jest.fn().mockReturnThis(),
    frames: jest.fn().mockReturnThis(),
    output: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation(function (event, callback) {
      if (event === 'end') setImmediate(callback);
      return this;
    }),
    run: jest.fn(),
  };

  const ffmpegFn = jest.fn(() => mockFfmpegInstance);

  Object.assign(ffmpegFn, {
    ffprobe: jest.fn(
      (filePath: string, cb: (err: any, metadata: any) => void) => {
        cb(null, { format: { duration: 20 } });
      },
    ),
    setFfmpegPath: jest.fn(),
    setFfprobePath: jest.fn(),
  });

  return ffmpegFn;
});

describe('FrameExtractorHandler', () => {
  const mockFfmpegInstance: Partial<FfmpegCommand> = {
    seekInput: jest.fn().mockReturnThis(),
    frames: jest.fn().mockReturnThis(),
    output: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation(function (event, callback) {
      if (event === 'end') callback();
      return this;
    }),
    run: jest.fn(),
    ffprobe: jest.fn(),
  };

  const mockVideoBuffer = Buffer.from('fake-video');
  let frameExtractor: FrameExtractorHandler;

  beforeEach(() => {
    frameExtractor = new FrameExtractorHandler();

    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.readdir as jest.Mock).mockResolvedValue(['frame-0.jpg']);
    (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('fake-frame'));
    (fs.rm as jest.Mock).mockResolvedValue(undefined);
    (Ffmpeg as unknown as jest.Mock).mockReturnValue(
      mockFfmpegInstance as unknown as FfmpegCommand,
    );
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

  it('should throw an error if ffprobe fails', async () => {
    // sobrescreve o ffprobe para simular erro
    (
      Ffmpeg as unknown as jest.Mock & { ffprobe: jest.Mock }
    ).ffprobe.mockImplementationOnce(
      (filePath: string, cb: (err: Error, metadata: any) => void) => {
        cb(new Error('ffprobe failed'), null);
      },
    );

    await expect(
      frameExtractor.extractFromBuffer({ video: mockVideoBuffer }),
    ).rejects.toThrow('ffprobe failed');
  });

  it('should fallback to 0 if ffprobe returns no duration', async () => {
    const ffmpegModule = require('fluent-ffmpeg');
    ffmpegModule.ffprobe.mockImplementationOnce((filePath: string, cb: any) => {
      cb(null, { format: {} }); // Sem duration
    });

    const frames = await frameExtractor.extractFromBuffer({
      video: mockVideoBuffer,
    });

    expect(frames).toBeInstanceOf(Array);
  });
});
