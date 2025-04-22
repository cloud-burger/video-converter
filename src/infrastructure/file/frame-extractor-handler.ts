import logger from '@cloud-burger/logger';
import Ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { execSync } from 'child_process';

try {
  const output = execSync('/opt/nodejs/bin/ffmpeg -version').toString();
  console.log('ffmpeg is executable:', output.split('\n')[0]);
} catch (error) {
  console.error('Error executing ffmpeg:', error);
}

try {
  const output = execSync('/opt/nodejs/bin/ffprobe -version').toString();
  console.log('ffprobe is executable:', output.split('\n')[0]);
} catch (error) {
  console.error('Error executing ffprobe:', error);
}

// Configure o caminho para os binários do FFmpeg
Ffmpeg.setFfmpegPath('/opt/nodejs/bin/ffmpeg');
Ffmpeg.setFfprobePath('/opt/nodejs/bin/ffprobe');

export interface ExtractFramesFromBufferInput {
  video: Buffer;
}

export interface ExtractedFrame {
  name: string;
  content: Buffer;
  extension: string;
}

export class FrameExtractorHandler {
  private readonly interval = 20;

  async extractFromBuffer({
    video,
  }: ExtractFramesFromBufferInput): Promise<ExtractedFrame[]> {
    logger.debug('Init frame extractor tmp dir');

    const tmpDir = path.join(os.tmpdir(), `video-${uuidv4()}`);
    const videoPath = path.join(tmpDir, 'input.mp4');
    const outputFolder = path.join(tmpDir, 'frames');

    await fs.mkdir(outputFolder, { recursive: true });
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(videoPath, video);

    logger.debug('Getting video duration');
    const duration = await this.getVideoDuration(videoPath);

    for (let second = 0; second < duration; second += this.interval) {
      logger.debug('Writing new frame');

      const outputPath = path.join(outputFolder, `frame-${second}.jpg`);

      logger.debug('Getting frame');
      await this.captureFrame(videoPath, outputPath, second);
    }

    const files = await fs.readdir(outputFolder);

    logger.debug('Reading extracted frames');

    const frames: ExtractedFrame[] = await Promise.all(
      files.map(async (fileName) => {
        const content = await fs.readFile(path.join(outputFolder, fileName));
        return {
          name: fileName.replace('.jpg', ''),
          content,
          extension: 'jpg',
        };
      }),
    );

    await fs.rm(tmpDir, { recursive: true, force: true });

    logger.debug('Frame extraction done');

    return frames;
  }

  private getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      Ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          console.error('FFPROBE ERROR:', err);
          return reject(err);
        }
        resolve(metadata.format.duration ?? 0);
      });
    });
  }

  private captureFrame(
    videoPath: string,
    outputPath: string,
    second: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      Ffmpeg(videoPath)
        .seekInput(second)
        .frames(1)
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', reject)
        .run();
    });
  }
}
