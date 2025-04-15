import Connection from 'app/postgres/connection';
import Pool from 'app/postgres/pool';
import { PoolFactory } from 'app/postgres/pool-factory';
import { APIGatewayEvent } from 'aws-lambda';
import { mock } from 'jest-mock-extended';
import { handler } from '.';

jest.mock('~/app/postgres/connection');
jest.mock('~/app/postgres/pool');
jest.mock('~/app/postgres/pool-factory');
jest.mock('~/controllers/get-video-frames-url');

describe('Handlers - Get video frames url', () => {
  const poolFactoryMock = jest.mocked(PoolFactory);

  it('should call get video frames url controller', async () => {
    const dbClientMock = mock<Pool>();

    poolFactoryMock.getPool.mockResolvedValue(dbClientMock);
    dbClientMock.getConnection.mockResolvedValue(mock<Connection>());
    const event = mock<APIGatewayEvent>();

    await handler(event);
  });
});
