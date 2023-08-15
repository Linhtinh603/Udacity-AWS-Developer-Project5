import 'source-map-support/register';
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';

// const es = new elasticsearch.Client({
//   hosts: [esHost],
//   connectionClass: httpAwsEs
// });

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  console.log('Received stream event from DynamoDB', JSON.stringify(event));

  for (const record of event.Records) {
    console.log('Processing record', JSON.stringify(record));
    if (record.eventName !== 'INSERT') {
      continue;
    }

    // const newMemory = record.dynamodb.NewImage;
    // const memoryId = newMemory;
    // const body = {};

    // // await es.index({
    // //   index: 'memory-index',
    // //   type: 'memory',
    // //     id: memoryId,
    // //   body: body
    // // });
  }
};
