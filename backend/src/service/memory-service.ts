import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import {
  insertMemoryItem,
  getMemoryItemsByUserId,
  updateMemoryItem,
  deleteMemoryItem
} from '../data-layer';
import { MemoryItem, MemoryUpdateItem } from '../models';
import {
  getAttachmentUrl,
  getUploadUrl,
  deleteMemoryPicture,
  deleteThumbnailMemoryPicture,
  getThumbnailAttachmentUrl
} from '../storage-layer';
import { CreateMemoryRequest, UpdateMemoryRequest } from '../requests';
import { createLogger } from '../utils/logger';

/**
 * Implement business logic
 */

const logger = createLogger('MemoryService');

export const createMemory = async (createMemoryRequest: CreateMemoryRequest, userId: string) => {
  logger.info(`Receive createMemory request of userId ${userId}`);

  const memoryId = uuidv4();
  const createdAt = new Date().toISOString();
  const attachmentUrl = getAttachmentUrl(memoryId);
  const thumbnailAttachmentUrl = getThumbnailAttachmentUrl(memoryId);

  createMemoryRequest.memoryDate = createMemoryRequest.memoryDate
    ? moment().format(createMemoryRequest.memoryDate)
    : null;

  const newItem: MemoryItem = {
    userId,
    memoryId,
    attachmentUrl,
    thumbnailAttachmentUrl,
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
  memoryId: string,
  updateMemoryRequest: UpdateMemoryRequest
) => {
  logger.info(`Receive updateMemory request of User ID: ${userId} for Memory ID: ${memoryId}`);

  updateMemoryRequest.memoryDate = updateMemoryRequest.memoryDate
    ? moment().format(updateMemoryRequest.memoryDate)
    : null;

  const memoryUpdateItem: MemoryUpdateItem = {
    userId,
    memoryId,
    ...updateMemoryRequest
  };

  await updateMemoryItem(userId, memoryId, memoryUpdateItem);
};

export const deleteMemory = async (userId: string, memoryId: string) => {
  logger.info(`Receive deleteMemory request of User ID: ${userId} for Memory ID: ${memoryId}`);

  await deleteMemoryItem(userId, memoryId);

  await deleteMemoryPicture(memoryId);

  await deleteThumbnailMemoryPicture(memoryId);
};

export const createImagePresignedUrl = (attachmentId: string): string => {
  logger.info(`Receive createImagePresignedUrl request of attachmentId ${attachmentId}`);

  return getUploadUrl(attachmentId);
};
