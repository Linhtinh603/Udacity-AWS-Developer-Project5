import { S3Event, SNSEvent, SNSHandler } from 'aws-lambda';
import { snsProcessS3Event } from '../../service';

export const handler: SNSHandler = async (event: SNSEvent) => {
  console.log(`Receive SNS Event for sending notification - records count: `, event.Records.length);

  for (const snsRecord of event.Records) {
    const s3EventString = snsRecord.Sns.Message;

    const s3Event: S3Event = JSON.parse(s3EventString);

    await snsProcessS3Event(s3Event);
  }
};
