import { S3Event, S3Handler } from 'aws-lambda';
import { UploadPictureToThumnailBucket } from '../../service';

export const handler: S3Handler = async (event: S3Event) => {
  for (const record of event.Records) {
    // "record" is an instance of S3EventRecord
    await UploadPictureToThumnailBucket(record); // A function that should resize each image
  }
};
