import { useState } from 'react';
import { s3UploadImage } from '../aws/OnadAWS';

export interface OnadUploadedImageData {
  imageName: string;
  imageBase64: string;
  imageFile: File;
}
export interface ImageListUploadHookResult<T> {
  images: T[];
  handleImageUpload: (imageData: T) => void;
  handleImageRemove: (imageName: string) => void;
  uploadToS3: (key: string, onSuccess: () => void, onFail: (err: any) => void) => Promise<void[]>;
}
export interface ImageListUploadHookOptions {
  limit: number;
}
export default function useImageListUpload<T extends OnadUploadedImageData>(
  options?: ImageListUploadHookOptions,
): ImageListUploadHookResult<T> {
  const [images, setImages] = useState<T[]>([]);

  /**
   * 이미지 목록에 이미지 추가 핸들러
   * @param imageData 목록에 추가할 이미지 데이터
   */
  function handleImageUpload(imageData: T): void {
    if (options && images.length >= options.limit) return alert(`이미지는 최대 ${options.limit}장까지 업로드 가능합니다.`);
    return setImages((prev) => {
      // 이미 동일한 이미지가 업로드 되지 않았을 때만 추가
      if (prev.filter((i) => i.imageName === imageData.imageName).length === 0) {
        return prev.concat(imageData);
      }
      return prev;
    });
  }

  /**
   * 이미지 목록에서 이미지 제거
   * @param imageName 목록에서 제거할 이미지 이름
   */
  function handleImageRemove(imageName: string): void {
    setImages((prev) => prev.filter((imageData) => imageData.imageName !== imageName));
  }

  /**
   * S3에 현재 이미지 목록에 포함된 이미지 파일들을 업로드하는 함수.
   * @param key S3 Key, 저장할 폴더
   * @param onSuccess 성공시 콜백
   * @param onFail 실패시 콜백
   */
  function uploadToS3(
    key: string, onSuccess: () => void, onFail: (err: any) => void
  ): Promise<void[]> {
    return Promise.all(
      images.map(
        (image) => s3UploadImage({ key, filename: image.imageName, file: image.imageFile, })
          .then(onSuccess, onFail)
          .catch(onFail)
      )
    );
  }

  return {
    images,
    handleImageUpload,
    handleImageRemove,
    uploadToS3
  };
}
