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

const params = {
  Bucket: AWS_S3_BUCKET_NAME
};

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

function uploadImage(): void {
  s3.putObject({
    ...params,
    Key: 'test.txt', // 파일명
    Body: 'the text', // 파일 소스 Binary string
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

function updateImage(): void {

}

export default { getImages, uploadImage };
