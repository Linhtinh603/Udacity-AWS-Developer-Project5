import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { updateMemory } from '../../service';
import { UpdateMemoryRequest } from '../../requests';
import { getUserId } from '../auth/helper';

// Update  Memory item for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const memoryId = event.pathParameters.memoryId;
    const updateMemoryRequest: UpdateMemoryRequest = JSON.parse(event.body);

    await updateMemory(userId, memoryId, updateMemoryRequest);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(updateMemoryRequest)
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
);
