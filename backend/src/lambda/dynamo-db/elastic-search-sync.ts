// import 'source-map-support/register';
// import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
// import  elasticsearch from 'elasticsearch';
// import  httpAwsEs from 'http-aws-es';
// import { MemoryItem } from '../../models';

// const es = new elasticsearch.Client({
//   hosts: [esHost],
//   connectionClass: httpAwsEs
// });

// export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
//   console.log('Received stream event from DynamoDB', JSON.stringify(event));

//   for (const record of event.Records) {
//     if (record.eventName !== 'INSERT') {
//       continue;
//     }

//     const newMemory = record.dynamodb.NewImage;
//     const memoryId = newMemory;
//     const body = {};

//     await es.index({
//       index: 'memory-index',
//       type: 'memory',
//         id: memoryId,
//       body: body
//     });
//   }
// };
