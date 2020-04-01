import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

const AWS_REGION = 'ap-northeast-2';
const AWS_S3_BUCKET_NAME = 'onad-static-files';

AWS.config.update({ region: AWS_REGION });
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_ACCESS_KEY_SECRET,
});

const params = { Bucket: AWS_S3_BUCKET_NAME };

type S3Folders = 'adpage-background/' | 'banner/' | 'business-regi/'| undefined;
function getImages(folder?: S3Folders, howMuch = 100): void {
  s3.listObjectsV2({
    ...params,
    Delimiter: '/',
    Prefix: folder,
    MaxKeys: howMuch
  }, (err, data) => {
    if (err) { console.log('error in S3.getImages - ', err); }
    console.log('data.contents: ', data.Contents);
    return data.Contents;
  });
}

/**
 * S3에 이미지를 업로드 하는 함수.
 * @param name 업로드 할 파일명. 업로드 될 경로를 적어야 함. 폴더안인 경우 폴더명 포함
 * @param image 이미지 소스
 * @example
 * S3.uploadImage('banner/asdf.png', ASDFImage);
 */
function uploadImage(
  name: string,
  image?: string | Buffer | Uint8Array | Blob
): void {
  s3.putObject({
    ...params,
    Key: name, // 파일명
    Body: image, // 파일 소스 Binary string
    Tagging: 'name=justfortest'
  }, (err, data) => {
    if (err) { console.log('error in S3.uploadImage - ', err); }
    console.log(data);
  });
}

function deleteImage(fileName: string): void {
  s3.deleteObject({
    ...params,
    Key: fileName
  }, (err, data) => {
    if (err) { console.log('error in S3.deleteImage - ', err); }
    console.log(data);
  });
}

async function migrateFromDB(): Promise<void> {
  // 현재 DB 값 조회
  const bannerSelectQuery = 'SELECT bannerId, marketerId, bannerSrc FROM bannerRegistered';
  const businessSelectQuery = 'SELECT marketerId, marketerBusinessRegSrc FROM bannerRegistered';
  const adpageSelectQuery = 'SELECT creatorId, creatorTwitchId, creatorBackgroundImage FROM creatorLanding';

  // 현재 DB의 이미지 S3로 업로드
  // uploading Base64 Image to S3 : https://stackoverflow.com/questions/7511321/uploading-base64-encoded-image-to-amazon-s3-via-node-js
  interface ImageData {
      type: string;
      data: string | Buffer;
  }
  // base64 to image buffer function
  function decodeBase64Image(dataString: string): ImageData {
    const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    const response: ImageData = { type: '', data: '' };

    if (matches) {
      if (matches.length !== 3) {
        throw new Error('Invalid input string');
      }
      const fileType = matches[1];
      response.type = fileType;
      response.data = Buffer.from(matches[2], 'base64');
    }
    return response;
  }

  // 현재 DB의 값 모두 S3 URL로 변경

  // 이미지 데이터 조회하는 모든 곳 url로 조회하도록 변경

  // 이미지 업로드하는 모든 곳 S3로 업로드하도록 변경

  // Base
}

export default { getImages, uploadImage, deleteImage };
