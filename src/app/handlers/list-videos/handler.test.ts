import { APIGatewayEvent } from 'aws-lambda';
import { mock } from 'jest-mock-extended';
import { handler } from '.';

describe('Handlers - List videos', () => {
  it('should call list videos controller', async () => {
    const event = mock<APIGatewayEvent>();

    await handler(event);
  });
});
