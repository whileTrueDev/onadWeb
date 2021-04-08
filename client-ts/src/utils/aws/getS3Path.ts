/* eslint-disable import/prefer-default-export */
import path from 'path';

export const S3_BUCKET_NAME = 'onad-static-files';
export const S3_BUCKET_REGION = 'ap-northeast-2';
export const S3_BASE_URL = `https://${S3_BUCKET_NAME}.s3.${S3_BUCKET_REGION}.amazonaws.com/`;

export function getReadableS3MerchandiseImagePath(
  marketerId: string, merchandiseId: number, fileName?: string
): string {
  const result = path.join(
    'merchandises',
    marketerId,
    String(merchandiseId),
    fileName || ''
  );
  return S3_BASE_URL + result;
}

export function getReadableS3MerchandiseDescImagePath(
  marketerId: string, merchandiseId: number, fileName?: string
): string {
  const result = path.join(
    S3_BASE_URL,
    'merchandises',
    marketerId,
    String(merchandiseId),
    'desc-images',
    fileName || ''
  );
  return S3_BASE_URL + result;
}

export function getS3MerchandiseImagePath(
  marketerId: string, merchandiseId: number, fileName?: string
): string {
  const result = path.join(
    'merchandises',
    marketerId,
    String(merchandiseId),
    fileName || ''
  );
  return result;
}

export function getS3MerchandiseDescImagePath(
  marketerId: string, merchandiseId: number, fileName?: string
): string {
  return path.join(
    'merchandises',
    marketerId,
    String(merchandiseId),
    'desc-images',
    fileName || ''
  );
}
