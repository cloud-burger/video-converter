import { APIGatewayEvent } from 'aws-lambda';
import { mock } from 'jest-mock-extended';
import { handler } from '.';

describe('Handlers - Get video url', () => {
  it('should call get video url controller', async () => {
    const event = mock<APIGatewayEvent>();

    await handler(event);
  });
});
