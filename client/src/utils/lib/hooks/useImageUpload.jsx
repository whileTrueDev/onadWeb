import React from 'react';
import axios from '../../axios';
import HOST from '../../config';

const IMAGE_SIZE_LIMIT = 1048576 * 3;

export default function useImageUpload(DEFAULT_IMAGE, url, snackOpenFunction, callUrl) {
  const [imageUrl, setImageUrl] = React.useState(DEFAULT_IMAGE);
  const [imageName, setImageName] = React.useState('');
  // image reset
  function handleReset() {
    setImageName('');
    setImageUrl(DEFAULT_IMAGE);
  }
  function handleImageChange({ newImageName, newImageUrl }) {
    setImageName(newImageName);
    setImageUrl(newImageUrl);
  }

  function handleUploadClick() {
    axios.post(`${HOST}${url}`, { imageUrl })
      .then((res) => {
        if (res.data[0]) {
          snackOpenFunction();
          if (callUrl) {
            callUrl();
          }
        } else {
          alert('현재는 등록할 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const readImage = (event) => {
    if (event.target.files.length !== 0) {
      const fileRegx = /^image\/[a-z]*$/;
      const myImage = event.target.files[0];
      // 최대 size를 지정하자.
      if (fileRegx.test(myImage.type)) {
        if (myImage.size < IMAGE_SIZE_LIMIT) {
          const reader = new FileReader();
          reader.readAsDataURL(myImage);
          reader.onload = () => {
            handleImageChange({ newImageName: myImage.name, newImageUrl: reader.result });
          };
        } else {
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
    handleUploadClick
  };
}
