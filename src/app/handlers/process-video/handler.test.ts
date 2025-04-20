import { S3Event } from 'aws-lambda';
import { mock } from 'jest-mock-extended';
import Connection from '~/app/postgres/connection';
import Pool from '~/app/postgres/pool';
import { PoolFactory } from '~/app/postgres/pool-factory';
import { handler } from '.';

jest.mock('~/app/postgres/connection');
jest.mock('~/app/postgres/pool');
jest.mock('~/app/postgres/pool-factory');

describe('Handlers - Process video', () => {
  const poolFactoryMock = jest.mocked(PoolFactory);

  it('should call process video controller', async () => {
    const dbClientMock = mock<Pool>();

    poolFactoryMock.getPool.mockResolvedValue(dbClientMock);
    dbClientMock.getConnection.mockResolvedValue(mock<Connection>());
    const event = mock<S3Event>({
      Records: [],
    });

    await handler(event);
  });
});
