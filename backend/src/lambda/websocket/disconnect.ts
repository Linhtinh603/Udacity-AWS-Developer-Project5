import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { removeConnection } from '../../service';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('websocket disconnected', event);

  const connectionId = event.requestContext.connectionId;

  await removeConnection(connectionId);

  return {
    statusCode: 200,
    body: ''
  };
};
