import { S3EventRecord } from 'aws-lambda';
import { getMemoryPicture, uploadToThumnailBucket } from '../storage-layer';
import Jimp from 'jimp';
import { createLogger } from '../utils/logger';

const logger = createLogger('ImageService');

export const UploadPictureToThumnailBucket = async (record: S3EventRecord) => {
  const attachmentId = record.s3.object.key;

  const body = await getMemoryPicture(attachmentId);

  let convertedBuffer: Buffer;

  try {
    // Read an image with the Jimp library
    const image = await Jimp.read(body as Buffer);
    // Resize an image maintaining the ratio between the image's width and height

    image.resize(150, Jimp.AUTO);

    // Convert an image to a buffer that we can write to a different bucket
    convertedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
  } catch (error) {
    logger.error('Failed to resize image', error);
    throw new Error('Failed to resize image');
  }

  await uploadToThumnailBucket(attachmentId, convertedBuffer);
};
