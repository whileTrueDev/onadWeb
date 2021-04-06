import AWS from 'aws-sdk';
import path from 'path';

const onadImageBucketName = 'onad-static-files';
const bucketRegion = 'ap-northeast-2';

AWS.config.update({
  region: bucketRegion,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.REACT_APP_AWS_S3_ACCESS_KEY_SECRET!,
  }
});

export default AWS;

export interface S3UploadImageOptions {
  key: string; filename: string; file: File;
}
export function s3UploadImage({
  key, filename, file,
}: S3UploadImageOptions): Promise<AWS.S3.ManagedUpload.SendData> {
  return new AWS.S3.ManagedUpload({
    params: {
      Bucket: onadImageBucketName,
      Key: path.join(key, filename),
      Body: file
    },
  }).promise();
}
