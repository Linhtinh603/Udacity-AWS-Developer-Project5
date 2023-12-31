/**
 * Fields in a request to update a single Memory  item.
 */
export interface UpdateMemoryRequest {
  name: string;
  memoryDate?: string;
  location?: string;
  content: string;
}
