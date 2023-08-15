import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import { ConnectionItem } from '../models';

/**
 * Implement data layer of Websocket connection table
 */
const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger('ConnectionAccess');

const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient();

const tableName = process.env.CONNECTION_TABLE;

export const insertConnectionItem = async (item: ConnectionItem) => {
  await docClient
    .put({
      TableName: tableName,
      Item: item
    })
    .promise();

  logger.info(`Insert new Connection successfully with id: ${item.id}`);
};

export const deleteConnectionItem = async (connectionId: string) => {
  const key = {
    id: connectionId
  };

  await docClient
    .delete({
      TableName: tableName,
      Key: key
    })
    .promise();

  logger.info(`Delete Connection successfully with id: ${connectionId}`);
};
