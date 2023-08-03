import {
  insertMemoryItem,
  getMemoryItemsByUserId,
  updateMemoryItem,
  deleteMemoryItem
} from '../data-layer';
import { MemoryItem } from '../models';
import { getUploadUrl } from '../storage-layer';
import { CreateMemoryRequest, UpdateMemoryRequest } from '../requests';
import { createLogger } from '../utils/logger';
import * as uuid from 'uuid';

/**
 * Implement business logic
 */

const logger = createLogger('MemoryService');

export const createMemory = async (createMemoryRequest: CreateMemoryRequest, userId: string) => {
  logger.info(`Receive createMemory request of userId ${userId}`);

  const memoryId = uuid.v4();
  const createdAt = new Date().toISOString();

  // TODO: Add image url

  const newItem: MemoryItem = {
    memoryId,
    userId,
    createdAt,
    ...createMemoryRequest
  };

  return await insertMemoryItem(newItem);
};

export const getMemoriesByUserId = async (userId: string): Promise<Array<MemoryItem>> => {
  logger.info(`Receive getMemoriesByUserId request of User ID:  ${userId}`);

  return await getMemoryItemsByUserId(userId);
};

export const updateMemory = async (
  userId: string,
  MemoryId: string,
  updateMemoryRequest: UpdateMemoryRequest
) => {
  logger.info(`Receive updateMemory request of User ID: ${userId} for Memory ID: ${MemoryId}`);

  await updateMemoryItem(userId, MemoryId, updateMemoryRequest);
};

export const deleteMemory = async (userId: string, MemoryId: string) => {
  logger.info(`Receive deleteMemory request of User ID: ${userId} for Memory ID: ${MemoryId}`);

  await deleteMemoryItem(userId, MemoryId);
};

export const createImagePresignedUrl = async (attachmentId: string): Promise<string> => {
  logger.info(`Receive createImagePresignedUrl request of attachmentId ${attachmentId}`);

  return await getUploadUrl(attachmentId);
};
