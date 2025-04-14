import { PassThrough } from 'stream';
import { FileCompressorHandler } from './compressor-handler';

const mockPassThroughPipe = jest.fn().mockImplementation();
const mockPassThroughOn = jest.fn().mockImplementation();

jest.mock('stream', () => ({
  PassThrough: jest.fn(() => ({
    destroy: jest.fn(),
    on: mockPassThroughOn,
    pipe: mockPassThroughPipe,
  })),
}));

const mockArchiverOn = jest.fn().mockImplementation();
const mockArchiverPipe = jest.fn().mockImplementation();
const mockArchiverFinalize = jest.fn().mockImplementation();

jest.mock('archiver', () =>
  jest.fn(() => ({
    pipe: mockArchiverPipe,
    on: mockArchiverOn,
    finalize: mockArchiverFinalize,
    append: jest.fn().mockImplementation(),
  })),
);

describe('Infrastructure - File Compressor Handler', () => {
  let mockPassThrough: jest.Mocked<PassThrough>;
  let fileCompressorHandler: FileCompressorHandler;
  const mockUint8Array = new Uint8Array();

  beforeEach(() => {
    mockPassThrough = new (PassThrough as any)();
    fileCompressorHandler = new FileCompressorHandler();
  });

  it('should compress zip successfully', async () => {
    mockPassThroughOn.mockImplementationOnce(
      (event: string, callback: (chunk: Uint8Array) => void) => {
        if (event === 'data') {
          callback(mockUint8Array);
        }
      },
    );

    await fileCompressorHandler.compress([
      {
        content: Buffer.from('image'),
        extension: 'jpg',
        name: 'frame-1',
      },
    ]);

    expect(mockArchiverFinalize).toHaveBeenCalled();
  });

  it('should destroy zip buffer on archive error', async () => {
    mockPassThroughOn.mockImplementationOnce(
      (event: string, callback: (chunk: Uint8Array) => void) => {
        if (event === 'data') {
          callback(mockUint8Array);
        }
      },
    );

    const error = new Error('Unknown error');
    mockArchiverOn.mockImplementationOnce(
      (event: string, callback: (error: Error) => void) => {
        if (event === 'error') {
          callback(error);
        }
      },
    );

    try {
      await fileCompressorHandler.compress([
        {
          content: Buffer.from('image'),
          extension: 'jpg',
          name: 'frame-1',
        },
      ]);
    } catch (error) {
      expect(mockPassThrough.destroy).toHaveBeenNthCalledWith(1, error);
    }
  });

  it('should throw error when unable to generate stream', async () => {
    mockPassThroughOn.mockImplementationOnce(
      (event: string, callback: (chunk: Uint8Array) => void) => {
        if (event === 'data') {
          callback(mockUint8Array);
        }
      },
    );

    const error = new Error('Failed to push stream');
    mockPassThroughOn.mockImplementationOnce(
      (event: string, callback: (error: Error) => void) => {
        if (event === 'error') {
          callback(error);
        }
      },
    );

    await expect(
      fileCompressorHandler.compress([
        {
          content: Buffer.from('image'),
          extension: 'jpg',
          name: 'frame-1',
        },
      ]),
    ).rejects.toThrow();
  });
});
