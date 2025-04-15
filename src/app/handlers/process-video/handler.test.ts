import { APIGatewayEvent } from 'aws-lambda';
import { mock } from 'jest-mock-extended';
import { handler } from '.';

describe('Handlers - Process video', () => {
  it('should call process video controller', async () => {
    const event = mock<APIGatewayEvent>();

    await handler(event);
  });
});
