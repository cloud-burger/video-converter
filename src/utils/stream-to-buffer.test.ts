import { Readable } from 'stream';
import { streamToBuffer } from './stream-to-buffer';

describe('Utils - streamToBuffer', () => {
  it('should convert a readable stream with buffers into a single buffer', async () => {
    const inputChunks = [Buffer.from('Hello '), Buffer.from('world!')];
    const readable = Readable.from(inputChunks);

    const result = await streamToBuffer(readable);

    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString()).toBe('Hello world!');
  });

  it('should convert a readable stream with strings into a single buffer', async () => {
    const inputChunks = ['Stream ', 'to ', 'buffer!'];
    const readable = Readable.from(inputChunks);

    const result = await streamToBuffer(readable);

    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString()).toBe('Stream to buffer!');
  });

  it('should return an empty buffer when stream is empty', async () => {
    const readable = Readable.from([]);

    const result = await streamToBuffer(readable);

    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBe(0);
  });
});
