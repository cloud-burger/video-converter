import archiver from 'archiver';
import { PassThrough } from 'stream';

type CompressInput = {
  name: string;
  content: Buffer;
  extension: string;
};

export class FileCompressorHandler {
  async compress(files: CompressInput[]): Promise<Buffer> {
    const zipStream = new PassThrough();

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    const chunks: Uint8Array[] = [];

    zipStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    zipStream.on('error', (err) => {
      throw err;
    });

    archive.pipe(zipStream);

    archive.on('error', (error: Error) => {
      zipStream.destroy(error);
    });

    files.forEach((file) => {
      archive.append(file.content, {
        name: `${file.name}.${file.extension}`,
      });
    });

    await archive.finalize();

    return Buffer.concat(chunks);
  }
}
