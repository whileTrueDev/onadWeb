import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '../../../../atoms/CustomButtons/Button';
import CustomCard from '../../../../atoms/CustomCard';
import StyledItemText from '../../../../atoms/StyledItemText';
// utils
import useImageUpload, { ImageData, UploadImage } from '../../../../utils/hooks/useImageUpload';
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';
// style and interface
import useAdPageImageUploadFormStyles from './AdPageImageUploadForm.style';
import AdPageData from './AdPageData.interfece';

const defaultImage = '/pngs/landing/background-whale.jpg';

// 배경이미지 업로드, 기본이미지로 돌아가기 button
interface ImageUploadButtonsProps {
  imageUrl: UploadImage;
  userImage: string;
  handleUploadClick: () => void;
  handleImageChange: (a: ImageData) => void;
}
const Buttons = ({
  imageUrl, userImage, handleUploadClick, handleImageChange
}: ImageUploadButtonsProps): JSX.Element => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
    <Button
      color="primary"
      disabled={imageUrl === userImage}
      onClick={(): void => { handleUploadClick(); }}
    >
      변경 저장하기
    </Button>

    <Button
      color="secondary"
      disabled={imageUrl === defaultImage}
      onClick={(): void => { handleImageChange({ newImageUrl: defaultImage }); }}
    >
      기본 이미지로
    </Button>
  </div>
);

interface LandingImageUploadFormProps {
  userData: AdPageData;
  handleSnackOpen: () => void;
}
/**
 * @deprecated
 * @author hwasurr 2021. 02. 02
 */
export default function LandingImageUploadForm({
  userData, handleSnackOpen
}: LandingImageUploadFormProps): JSX.Element {
  const isLgWidth = useMediaQuery('(min-width:1200px)');
  const classes = useAdPageImageUploadFormStyles();


  // 배경 이미지 업로드를 위한 훅
  const {
    imageUrl, readImage, handleImageChange
  } = useImageUpload(userData.creatorBackgroundImage);

  const backgroundPatch = usePatchRequest('/creator/ad-page', () => {
    handleSnackOpen();
  });

  return (
    <CustomCard
      iconComponent={<StyledItemText primary="배경이미지 업로드" color="white" />}
      buttonComponent={isLgWidth && (
      <Buttons
        imageUrl={imageUrl}
        userImage={userData.creatorBackgroundImage}
        handleUploadClick={(): void => {
          backgroundPatch.doPatchRequest({
            creatorBackgroundImage: imageUrl
          });
        }}
        handleImageChange={handleImageChange}
      />
      )}
    >
      <div className={classes.imageWrapper}>
        <div
          className={classes.imageSrc}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        <div>
          <Button className={classes.imageButton} size="large" color="primary">
            <input
              style={{ padding: 0, width: '90%', maxWidth: 300 }}
              type="file"
              id="getfile"
              accept="image/*"
              onChange={(e): void => { readImage(e); }}
            />
          </Button>
        </div>
      </div>

      {!isLgWidth && (
      <Buttons
        imageUrl={imageUrl}
        userImage={userData.creatorBackgroundImage}
        handleUploadClick={(): void => {
          backgroundPatch.doPatchRequest({
            creatorBackgroundImage: imageUrl
          });
        }}
        handleImageChange={handleImageChange}
      />
      )}
    </CustomCard>
  );
}
