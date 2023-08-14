import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);

/**
 * Implement file storage logic
 */
const s3 = new XAWS.S3({ signatureVersion: 'v4' });
const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const thumbnailBucketName = process.env.THUMNAIL_ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export const getAttachmentUrl = (attachmentId: string): string => {
  return `https://${bucketName}.s3.amazonaws.com/${attachmentId}`;
};

export const getUploadUrl = (attachmentId: string): string => {
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: parseInt(urlExpiration)
  });

  return uploadUrl;
};

export const getMemoryPicture = async (attachmentId: string): Promise<AWS.S3.Body> => {
  const response = await s3
    .getObject({
      Bucket: bucketName,
      Key: attachmentId
    })
    .promise();

  return response.Body;
};

export const deleteMemoryPicture = async (attachmentId: string) => {
  await s3
    .deleteObject({
      Bucket: bucketName,
      Key: attachmentId
    })
    .promise();
};

export const uploadToThumnailBucket = async (attachmentId: string, convertedBuffer: Buffer) => {
  await s3
    .putObject({
      Bucket: thumbnailBucketName,
      Key: `${attachmentId}.jpeg`,
      Body: convertedBuffer
    })
    .promise();
};

export const deleteThumnailMemoryPicture = async (attachmentId: string) => {
  await s3
    .deleteObject({
      Bucket: thumbnailBucketName,
      Key: `${attachmentId}.jpeg`
    })
    .promise();
};
