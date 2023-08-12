import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);

/**
 * Implement file storage logic
 */
const s3 = new XAWS.S3({ signatureVersion: 'v4' });
const bucketName = process.env.ATTACHMENT_S3_BUCKET;
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

export const deleteMemoryPicture = async (attachmentId: string) => {
  await s3
    .deleteObject({
      Bucket: bucketName,
      Key: attachmentId
    })
    .promise();
};
