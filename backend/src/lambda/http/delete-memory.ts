import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { deleteMemory } from '../../service';
import { getUserId } from '../helper';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const MemoryId = event.pathParameters.MemoryId;
    const userId = getUserId(event);

    await deleteMemory(userId, MemoryId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
);
