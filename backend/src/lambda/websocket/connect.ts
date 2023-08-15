import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { addNewConnection } from '../../service';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('websocket connected', event);

  const connectionId = event.requestContext.connectionId;

  await addNewConnection(connectionId);

  return {
    statusCode: 200,
    body: ''
  };
};
