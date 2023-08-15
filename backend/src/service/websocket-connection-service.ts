import { deleteConnectionItem, insertConnectionItem } from '../data-layer';
import { ConnectionItem } from '../models';

export const addNewConnection = async (connectionId: string) => {
  const timestamp = new Date().toISOString();

  const connectionItem: ConnectionItem = {
    id: connectionId,
    timestamp
  };

  await insertConnectionItem(connectionItem);
};

export const removeConnection = async (connectionId: string) => {
  await deleteConnectionItem(connectionId);
};
