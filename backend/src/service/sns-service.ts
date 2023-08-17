import { S3Event } from 'aws-lambda';
import { createLogger } from '../utils/logger';
import { deleteConnectionItem, getAllConnectionItems } from '../data-layer';
import { ApiGatewayManagementApi } from 'aws-sdk';

const logger = createLogger('SNSService');

const apiId = process.env.API_ID;
const stage = process.env.STAGE;

const connectionParams: ApiGatewayManagementApi.ClientConfiguration = {
  apiVersion: '2023-08-17',
  endpoint: `${apiId}.execute-api.us-east-1.amazonaws.com/${stage}`
};

const apiGateway = new ApiGatewayManagementApi(connectionParams);

export const snsProcessS3Event = async (s3Event: S3Event) => {
  const connections = await getAllConnectionItems();

  for (const record of s3Event.Records) {
    const key = record.s3.object.key;

    logger.info('Send notification - Process s3 event', { s3Key: key });

    const payload = {
      memoryId: key
    };

    // Send data to all clients
    for (const connection of connections) {
      const connectionId: string = connection.id;

      await sendMessageToClient(connectionId, payload);
    }
  }
};

const sendMessageToClient = async (connectionId: string, payload: Object) => {
  try {
    await apiGateway
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(payload)
      })
      .promise();
  } catch (error) {
    logger.error('Failed to send message', { error: JSON.stringify(error) });

    if (error.statusCode === 410) {
      console.log('Stale connection');
      await deleteConnectionItem(connectionId);
    }
  }
};
