/**
 * Fields in a request to create a single Memory  item.
 */
export interface CreateMemoryRequest {
  name: string;
  memoryDate: string;
  location: string;
  content: string;
}
