import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { deleteMemory } from '../../service';
import { getUserId } from '../helper';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const memoryId = event.pathParameters.memoryId;
    const userId = getUserId(event);

    await deleteMemory(userId, memoryId);

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
