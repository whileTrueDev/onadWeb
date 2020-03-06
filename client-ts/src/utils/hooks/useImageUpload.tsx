import React from 'react';
import axios from '../axios';
import HOST from '../../config';

const IMAGE_SIZE_LIMIT = 100000 * 10;

interface ImageData {
  newImageName: string;
  newImageUrl: string | ArrayBuffer | null;
}

interface UseImageUploadResult {
  imageUrl: string | ArrayBuffer | null;
  imageName: string;
  handleReset: () => void;
  handleImageChange: ({ newImageName, newImageUrl }: ImageData) => void;
  readImage: (event: Event) => void;
  handleUploadClick: () => void;
}

export default function useImageUpload(
  DEFAULT_IMAGE: string,
  imageUploadUrl: string,
  successCallback: () => void,
  reRequest?: () => void
): UseImageUploadResult {
  const [imageUrl, setImageUrl] = React.useState<string| ArrayBuffer |null>(DEFAULT_IMAGE);
  const [imageName, setImageName] = React.useState('');

  // image reset
  function handleReset(): void {
    setImageName('');
    setImageUrl(DEFAULT_IMAGE);
  }

  // image change handler
  function handleImageChange({ newImageName, newImageUrl }:
    {newImageName: string; newImageUrl: string | ArrayBuffer | null}): void {
    setImageName(newImageName);
    setImageUrl(newImageUrl);
  }

  const readImage = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const files = (target.files as FileList);
    if (files.length !== 0) {
      const fileRegx = /^image\/[a-z]*$/;
      const myImage = files[0];

      // image 확장자 검사
      if (fileRegx.test(myImage.type)) {
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

  function handleUploadClick(): void {
    axios.post(`${HOST}${imageUploadUrl}`, { imageUrl })
      .then((res) => {
        if (res.data[0]) {
          successCallback();
          if (reRequest) {
            reRequest();
          }
        } else {
          alert('현재는 등록할 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return {
    imageUrl,
    imageName,
    handleReset,
    handleImageChange,
    readImage,
    handleUploadClick
  };
}
