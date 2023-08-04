import { apiEndpoint } from '../config';
import Axios from 'axios';
import { MemoryDto, CreateMemoryRequest, UpdateMemoryRequest } from '../types';

export const getMemories = async (idToken: string): Promise<Array<MemoryDto>> => {
  console.log('Fetching memories');

  const response = await Axios.get(`${apiEndpoint}/memories`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
  console.log('memories:', response.data);
  return response.data.items;
};

export const createMemory = async (
  idToken: string,
  newMemory: CreateMemoryRequest
): Promise<MemoryDto> => {
  const response = await Axios.post(`${apiEndpoint}/memories`, JSON.stringify(newMemory), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
  return response.data.item;
};

export const updateMemory = async (
  idToken: string,
  memoryId: string,
  updateMemoryRequest: UpdateMemoryRequest
): Promise<void> => {
  await Axios.patch(`${apiEndpoint}/memories/${memoryId}`, JSON.stringify(updateMemoryRequest), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
};

export const deleteMemory = async (idToken: string, memoryId: string): Promise<void> => {
  await Axios.delete(`${apiEndpoint}/memories/${memoryId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
};

export const getUploadUrl = async (idToken: string, memoryId: string): Promise<string> => {
  const response = await Axios.post(`${apiEndpoint}/memories/${memoryId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  });
  return response.data.uploadUrl;
};

export const uploadFile = async (uploadUrl: string, file: File): Promise<void> => {
  await Axios.put(uploadUrl, file);
};
