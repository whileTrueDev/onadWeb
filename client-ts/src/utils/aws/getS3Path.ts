/* eslint-disable import/prefer-default-export */
import path from 'path';

export const S3_BUCKET_NAME = 'onad-static-files';
export const S3_BUCKET_REGION = 'ap-northeast-2';
export const S3_BASE_URL = `https://${S3_BUCKET_NAME}.s3.${S3_BUCKET_REGION}.amazonaws.com/`;

export function getS3MerchandiseImagePath(
  marketerId: string, merchandiseId: string, fileName?: string
): string {
  return path.join(
    S3_BASE_URL,
    'merchandises',
    marketerId,
    merchandiseId,
    fileName || ''
  );
}
