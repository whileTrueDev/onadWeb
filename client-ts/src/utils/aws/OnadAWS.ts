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

// function encode(data: any) {
//   const str = data.reduce((a: any, b: any) => a + String.fromCharCode(b), '');
//   return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
// }


export const sts = new AWS.STS({ apiVersion: '2011-06-15' });

export const stsAuthAndGetObject = async (userId: string) => {
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'OnadSTSSecure',
        Effect: 'Allow',
        Action: ['s3:GetObject', 's3:PutObject'],
        Resource: `arn:aws:s3:::onad-privacy-files/${userId}/*`
      }
    ]
  };
  const stsAssumed = await sts.assumeRole({
    RoleArn: 'arn:aws:iam::803609402610:role/onadClientSTSRole',
    RoleSessionName: 'onadClientSTSRole',
    Policy: JSON.stringify(policy),
    DurationSeconds: 900, // 15minute
  }).promise();

  if (stsAssumed.Credentials) {
    const {
      AccessKeyId, SecretAccessKey, SessionToken, Expiration
    } = stsAssumed.Credentials;

    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: AccessKeyId,
        secretAccessKey: SecretAccessKey,
        sessionToken: SessionToken,
        expireTime: Expiration,
      }
    });

    const putdata = await s3.putObject({
      Bucket: 'onad-privacy-files',
      Key: `${userId}/test.txt`,
      Body: 'test',
    }).promise();
    console.log(putdata);

    const data = await s3.getObject({
      Bucket: 'onad-privacy-files',
      Key: 'hwasurr1/test.txt'
    }).promise();

    const spanTag = window.document.getElementById('s3-privacy-text') as HTMLSpanElement;
    spanTag.innerText = data.Body as string;

    console.log(`${userId}/test.txt: `, data);
  }
};
