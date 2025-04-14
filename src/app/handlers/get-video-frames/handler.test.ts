import { APIGatewayEvent } from 'aws-lambda';
import { mock } from 'jest-mock-extended';
import { handler } from '.';

describe('Handlers - Get video frames', () => {
  it('should call get video frames controller', async () => {
    const event = mock<APIGatewayEvent>();

    await handler(event);
  });
});
