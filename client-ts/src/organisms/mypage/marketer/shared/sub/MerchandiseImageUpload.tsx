import classnames from 'classnames';
import { Button, Chip, Dialog, makeStyles, Typography } from '@material-ui/core';
import { useRef, useState } from 'react';
import * as React from 'react';
import { useDialog } from '../../../../../utils/hooks';
import { MerchandiseImage } from '../../../../../utils/hooks/query/useMarketerMerchandisesList';

const useStyles = makeStyles(theme => ({
  uploadImageList: {
    maxWidth: '100%',
  },
  chipContainer: {
    margin: theme.spacing(1, 1, 1, 0),
  },
  rightSpace: {
    marginRight: theme.spacing(1),
  },
  previewTitle: {
    padding: theme.spacing(2),
  },
  previewButtonSet: {
    textAlign: 'right',
    marginBottom: theme.spacing(1),
  },
}));

export interface MerchandiseImageUploadProps {
  images: MerchandiseImage[];
  onImageUpload: (imageData: MerchandiseImage) => void;
  onImageRemove: (imageName: string) => void;
  limitMb?: number;
}
export default function MerchandiseImageUpload({
  images,
  onImageUpload,
  onImageRemove,
  limitMb = 5,
}: MerchandiseImageUploadProps): React.ReactElement {
  const classes = useStyles();

  const imagePreviewDialog = useDialog();

  // 미리보기를 위한 선택된 이미지 변수
  const [selectedImage, setSelectedImage] = useState<MerchandiseImage>();
  function handleSelectedImage(imageName: string): void {
    const imageData = images.find(ima => ima.imageName === imageName);
    if (imageData) {
      setSelectedImage(imageData);
    }
  }

  // 이미지 업로드 핸들러
  // eslint-disable-next-line consistent-return
  const readImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length !== 0 && event.target.files.length < 5) {
      const uploadedImage = event.target.files[0];
      const imageName = uploadedImage.name;

      // *******************************
      // 파일 크기 체크
      const MB_LIMIT = limitMb * 1024 * 1024;
      if (uploadedImage.size > MB_LIMIT) {
        return alert(`${limitMb}MB이하의 이미지만 업로드할 수 있습니다.`);
      }

      // *******************************
      // 여러 이미지에 대한 구분자로 사용될 , 가 이미지명에 포함되었는 지 체크
      if (imageName.includes(',')) {
        return alert('이미지 이름에는 "," 가 포함될 수 없습니다. "," 를 지운 뒤 업로드 바랍니다.');
      }

      const reader = new FileReader();
      reader.readAsDataURL(uploadedImage);
      reader.onload = (): void => {
        if (reader.result) {
          const imageData = {
            imageFile: uploadedImage,
            imageBase64: reader.result as string,
            imageName,
          };
          onImageUpload(imageData);
        }
      };
      reader.onerror = (): void =>
        alert(
          '이미지를 읽는 과정에서 오류가 발생했습니다. 동일 현상이 지속되는 경우, support@onad.io에 문의 바랍니다.',
        );
    }
  };

  const uploadInputRef = useRef<HTMLInputElement>(null);
  function handleImageRemove(imgName: string): void {
    onImageRemove(imgName);
    // 방금 지운 파일 재선택 안되는 현상 수정을 위한 처리 21 04 08 목 hwasurr
    if (uploadInputRef.current) {
      uploadInputRef.current.value = '';
    }
  }

  return (
    <div>
      <Button component="label" color="primary" variant="contained">
        <input
          id="merchandise-image-upload"
          multiple
          type="file"
          accept="image/*"
          hidden
          onChange={readImage}
          ref={uploadInputRef}
        />
        <Typography>파일찾기</Typography>
      </Button>

      <div className={classes.uploadImageList}>
        {images
          .map(image => image.imageName)
          .map(name => (
            <div key={name} className={classes.chipContainer}>
              <Chip label={name} className={classes.rightSpace} />
              <Button
                variant="outlined"
                onClick={(): void => {
                  handleSelectedImage(name);
                  imagePreviewDialog.handleOpen();
                }}
                size="small"
                className={classes.rightSpace}
              >
                미리보기
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={(): void => {
                  handleImageRemove(name);
                }}
              >
                제거
              </Button>
            </div>
          ))}
      </div>

      {/* 사진 미리보기 */}
      {selectedImage && (
        <Dialog
          maxWidth="xs"
          fullWidth
          open={imagePreviewDialog.open}
          onClose={imagePreviewDialog.handleClose}
        >
          <div>
            <div className={classes.previewTitle} style={{ padding: 16 }}>
              <Typography>{selectedImage.imageName}</Typography>
            </div>
            <img src={selectedImage.imageBase64} alt="selectedImage.imageName" width="100%" />

            <div className={classnames(classes.rightSpace, classes.previewButtonSet)}>
              <Button
                variant="contained"
                onClick={(): void => {
                  onImageRemove(selectedImage.imageName);
                  imagePreviewDialog.handleClose();
                }}
                className={classes.rightSpace}
              >
                사진 제거
              </Button>
              <Button variant="contained" color="primary" onClick={imagePreviewDialog.handleClose}>
                확인
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
