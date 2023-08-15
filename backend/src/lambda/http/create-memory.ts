import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { CreateMemoryRequest } from '../../requests';
import { getUserId } from '../auth/helper';
import { createMemory } from '../../service';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newMemory: CreateMemoryRequest = JSON.parse(event.body);

    const userId = getUserId(event);

    const newItem = await createMemory(newMemory, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
);
