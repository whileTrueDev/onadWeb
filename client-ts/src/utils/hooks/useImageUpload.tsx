import React from 'react';

const MB = 1048576; // 1Mbytes
const IMAGE_SIZE_LIMIT = 5 * MB;

export type UploadImage = string | ArrayBuffer | null;
export interface ImageData {
  newImageName?: string;
  newImageUrl: UploadImage;
}

export interface UseImageUploadResult {
  imageUrl: UploadImage;
  imageName: string | null | undefined;
  handleReset: () => void;
  handleImageChange: ({ newImageName, newImageUrl }: ImageData) => void;
  readImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * 이미지 업로드를 위한 훅.  
 * 10MB이하의 '이미지'파일 데이터만 (image URI scheme) 업로드 가능하다.
 * @param DEFAULT_IMAGE 기본이미지파일
 * @param imageUploadUrl 이미지를 업로드할 API 서버 엔드포인트
 * @param successCallback 이미지 업로드 성공시 콜백함수
 * @returns
 * iamgeUrl, imageName, handleReset, handleImageChange, readImage, handleUploadClick
 * @reference data_uri_scheme : https://en.wikipedia.org/wiki/Data_URI_scheme
 */
export default function useImageUpload(
  DEFAULT_IMAGE: string,
): UseImageUploadResult {
  const [imageUrl, setImageUrl] = React.useState<string | ArrayBuffer | null>(DEFAULT_IMAGE);
  const [imageName, setImageName] = React.useState<string | undefined>('');

  // image reset
  function handleReset(): void {
    setImageName('');
    setImageUrl(DEFAULT_IMAGE);
  }

  // image change handler
  function handleImageChange({ newImageName, newImageUrl }: ImageData): void {
    setImageName(newImageName);
    setImageUrl(newImageUrl);
  }

  const readImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    const files = (target.files as FileList);
    if (files.length !== 0) {
      const fileRegx = /^image\/[a-z]*$/;
      const myImage = files[0];
      // image 확장자 검사
      if (fileRegx.test(myImage.type) || myImage.type === 'application/pdf') {
        // 이미지 사이즈 검사
        if (myImage.size < IMAGE_SIZE_LIMIT) {
          // 사이즈 제한보다 작은 경우
          const reader = new FileReader();
          reader.readAsDataURL(myImage);
          reader.onload = (): void => {
            handleImageChange({ newImageName: myImage.name, newImageUrl: reader.result });
          };
        } else {
          // 사이즈 제한보다 큰 경우
          alert('10MB 이하의 이미지를 업로드해주세요.');
        }
      } else {
        alert('파일의 형식이 올바르지 않습니다.');
      }
    } else {
      handleReset();
    }
  };

  return {
    imageUrl,
    imageName,
    handleReset,
    handleImageChange,
    readImage,
  };
}
