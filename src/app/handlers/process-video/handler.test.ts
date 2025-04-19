import { S3Event } from 'aws-lambda';
import { mock } from 'jest-mock-extended';
import { handler } from '.';

describe('Handlers - Process video', () => {
  it('should call process video controller', async () => {
    const event = mock<S3Event>();

    await handler(event);
  });
});
