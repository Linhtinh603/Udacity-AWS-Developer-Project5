import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import { MemoryItem, MemoryUpdateItem } from '../models';
import { UpdateMemoryRequest } from '../requests';

/**
 * Implement data layer
 */
const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger('MemoryAccess');

const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient();

const tableName = process.env.MEMORY_TABLE;
const MemoryCreatedAtIndex = process.env.MEMORY_CREATED_AT_INDEX;

export const insertMemoryItem = async (memoryItem: MemoryItem): Promise<MemoryItem> => {
  await docClient
    .put({
      TableName: tableName,
      Item: memoryItem
    })
    .promise();

  logger.info(`Insert new Memory successfully with id: ${memoryItem.memoryId}`);

  return memoryItem;
};

export const getMemoryItemsByUserId = async (userId: string): Promise<Array<MemoryItem>> => {
  const result = await docClient
    .query({
      TableName: tableName,
      IndexName: MemoryCreatedAtIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    })
    .promise();

  const items = result.Items as Array<MemoryItem>;
  logger.info(`Get all Memories successfully: ${items}`);

  return items as Array<MemoryItem>;
};

export const getMemoryItemById = async (userId: string, memoryId: string): Promise<MemoryItem> => {
  const result = await docClient
    .get({
      TableName: tableName,
      Key: { userId: userId, memoryId: memoryId }
    })
    .promise();

  const item = result.Item;

  return item as MemoryItem;
};

export const updateMemoryItem = async (
  userId: string,
  memoryId: string,
  memoryUpdate: MemoryUpdateItem
): Promise<MemoryItem> => {
  const result = await docClient
    .update({
      TableName: tableName,
      Key: {
        userId: userId,
        memoryId: memoryId
      },
      ConditionExpression: 'attribute_exists(memoryId)',
      UpdateExpression:
        'set #attr_name = :name, memoryDate = :memoryDate, #attr_location = :location, content = :content',
      ExpressionAttributeNames: {
        '#attr_name': 'name', // to avoid reserved words
        '#attr_location': 'location' //to avoid reserved words
      },
      ExpressionAttributeValues: {
        ':name': memoryUpdate.name,
        ':memoryDate': memoryUpdate.memoryDate,
        ':location': memoryUpdate.location,
        ':content': memoryUpdate.content
      }
    })
    .promise();

  logger.info(`Update Memory successfully with ID: ${memoryId}`);

  return result.Attributes as MemoryItem;
};

export const deleteMemoryItem = async (userId: string, memoryId: string) => {
  await docClient
    .delete({
      TableName: tableName,
      Key: { userId: userId, memoryId: memoryId }
    })
    .promise();

  logger.info(`Delete Memory successfully with ID: ${memoryId}`);
};
