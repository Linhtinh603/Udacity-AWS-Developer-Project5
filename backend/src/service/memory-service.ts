import * as uuid from 'uuid';
import * as moment from 'moment';
import {
  insertMemoryItem,
  getMemoryItemsByUserId,
  updateMemoryItem,
  deleteMemoryItem
} from '../data-layer';
import { MemoryItem } from '../models';
import { getAttachmentUrl, getUploadUrl } from '../storage-layer';
import { CreateMemoryRequest, UpdateMemoryRequest } from '../requests';
import { createLogger } from '../utils/logger';

/**
 * Implement business logic
 */

const logger = createLogger('MemoryService');

export const createMemory = async (createMemoryRequest: CreateMemoryRequest, userId: string) => {
  logger.info(`Receive createMemory request of userId ${userId}`);

  const memoryId = uuid.v4();
  const createdAt = new Date().toISOString();
  const attachmentUrl = getAttachmentUrl(memoryId);
  createMemoryRequest.memoryDate = moment().format(createMemoryRequest.memoryDate);

  const newItem: MemoryItem = {
    userId,
    memoryId,
    attachmentUrl,
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

  updateMemoryRequest.memoryDate = moment().format(updateMemoryRequest.memoryDate);

  await updateMemoryItem(userId, MemoryId, updateMemoryRequest);
};

export const deleteMemory = async (userId: string, memoryId: string) => {
  logger.info(`Receive deleteMemory request of User ID: ${userId} for Memory ID: ${memoryId}`);

  await deleteMemoryItem(userId, memoryId);
};

export const createImagePresignedUrl = async (attachmentId: string): Promise<string> => {
  logger.info(`Receive createImagePresignedUrl request of attachmentId ${attachmentId}`);

  return await getUploadUrl(attachmentId);
};
