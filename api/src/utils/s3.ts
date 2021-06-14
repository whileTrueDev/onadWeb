import path from 'path';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

dotenv.config();

const AWS_REGION = 'ap-northeast-2';
const AWS_S3_BUCKET_NAME = 'onad-static-files';

AWS.config.update({ region: AWS_REGION });
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_ACCESS_KEY_SECRET,
});

const params = { Bucket: AWS_S3_BUCKET_NAME };

function getBaseUrl(): string {
  return ['https://', AWS_S3_BUCKET_NAME, '.s3.', AWS_REGION, '.amazonaws.com/'].join('');
}

type S3Folders = 'adpage-background/' | 'banner/' | 'business-regi/' | undefined;
async function getFolders(
  folder?: S3Folders,
  howMuch = 100,
): Promise<PromiseResult<AWS.S3.ListObjectsV2Output, AWS.AWSError>> {
  const prom = s3
    .listObjectsV2({
      ...params,
      Delimiter: '/',
      Prefix: folder,
      MaxKeys: howMuch,
    })
    .promise();

  return prom.catch(err => {
    console.log('error in S3.getImages - ', err);
    return err;
  });
}

async function getImagesByMarketerId(
  marketerId: string,
  howMuch = 100,
): Promise<PromiseResult<AWS.S3.ListObjectsV2Output, AWS.AWSError>> {
  const prom = s3
    .listObjectsV2({
      ...params,
      Delimiter: '/',
      Prefix: path.join('banner', `${marketerId}/`),
      MaxKeys: howMuch,
    })
    .promise();

  return prom.catch(err => {
    console.log('error in S3.getImages - ', err);
    return err;
  });
}

/**
 * S3에 이미지를 업로드 하는 함수.
 * @param name 업로드 할 파일명. 업로드 될 경로를 적어야 함. 폴더안인 경우 폴더명 포함
 * @param image 이미지 소스
 * @example
 * S3.uploadImage('banner/asdf.png', ASDFImage);
 */
function uploadImage(name: string, image: string | Buffer | Uint8Array | Blob): void {
  s3.putObject(
    {
      ...params,
      Key: name, // 파일명
      Body: image, // 파일 소스 Binary string
    },
    (err, data) => {
      if (err) {
        console.log('error in S3.uploadImage - ', err);
      }
      console.log(data);
    },
  );
}

/**
 * S3에 이미지를 업로드 하는 함수.
 * @param name 이미지 파일명
 * @param image 이미지 소스
 * @example
 * await S3.uploadImageAsync('banner/asdf.png', someImageBuffer);
 */
function uploadImageAsync(
  name: string,
  image: string | Buffer | Uint8Array | Blob,
  options?: Omit<AWS.S3.PutObjectRequest, 'Key' | 'Body' | 'Bucket'>,
): Promise<PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>> {
  return s3
    .putObject({
      ...params,
      Key: name, // 파일명
      Body: image, // 파일 소스 Binary string
      ContentType: options?.ContentType,
    })
    .promise();
}

function deleteImage(fileName: string): void {
  s3.deleteObject(
    {
      ...params,
      Key: fileName,
    },
    (err, data) => {
      if (err) {
        console.log('error in S3.deleteImage - ', err);
      }
      console.log(data);
    },
  );
}

export default {
  getBaseUrl,
  uploadImage,
  uploadImageAsync,
  deleteImage,
  getFolders,
  getImagesByMarketerId,
};
