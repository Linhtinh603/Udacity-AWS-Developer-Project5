export interface MemoryItem {
  userId: string;
  memoryId: string;
  name: string;
  memoryDate?: string;
  location?: string;
  content: string;
  attachmentUrl: string;
  thumbnailAttachmentUrl: string;
  createdAt: string;
}
