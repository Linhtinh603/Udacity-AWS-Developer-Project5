import 'source-map-support/register';
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import elasticsearch from 'elasticsearch';
import httpAwsEs from 'http-aws-es';

const esHost = process.env.ES_ENDPOINT;

const es = new elasticsearch.Client({
  hosts: [esHost],
  connectionClass: httpAwsEs
});

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    if (record.eventName !== 'INSERT') {
      continue;
    }

    console.log('Processing record', JSON.stringify(record));

    /* DynamoDB JSON
    @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.ResponseFormat
    */
    const newMemory = record.dynamodb.NewImage;
    const memoryId = newMemory.memoryId.S;

    const body = {
      memoryId: memoryId,
      userId: newMemory.userId.S,
      name: newMemory.name.S,
      content: newMemory.content.S,
      memoryDate: newMemory.memoryDate.S,
      attachmentUrl: newMemory.attachmentUrl.S,
      thumbnailAttachmentUrl: newMemory.thumbnailAttachmentUrl.S,
      createdAt: newMemory.createdAt.S
    };

    // Push data to Elasticsearch
    await es.index({
      index: 'memory-index',
      type: 'memory',
      id: memoryId,
      body: body
    });
  }
};
