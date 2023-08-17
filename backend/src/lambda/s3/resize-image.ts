import { S3Event, SNSEvent, SNSHandler } from 'aws-lambda';
import { UploadPictureToThumbnailBucket } from '../../service';

export const handler: SNSHandler = async (event: SNSEvent) => {
  console.log(`Receive SNS Event for resizing image - records count: `, event.Records.length);

  for (const snsRecord of event.Records) {
    const s3EventStr = snsRecord.Sns.Message;

    const s3Event: S3Event = JSON.parse(s3EventStr);

    for (const record of s3Event.Records) {
      await UploadPictureToThumbnailBucket(record);
    }
  }
};
