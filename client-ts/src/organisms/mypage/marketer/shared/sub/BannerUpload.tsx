import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Hidden, Typography, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import OnadBanner from '../../../../../atoms/Banner/OnadBanner';

const useStyle = makeStyles((theme: Theme) => ({
  helperText: { margin: theme.spacing(2, 0) },
  imgInput: {
    [theme.breakpoints.down('xs')]: {
      margin: '2px',
    },
    marginTop: '4px',
    fontSize: '15px',
  },
  imgPreview: {
    width: 'auto',
    height: 350,
    [theme.breakpoints.down('xs')]: { maxHeight: '200px' },
  },
  bannerContainer: { textAlign: 'center' },
  buttonSet: { maginTop: theme.spacing(2) },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface ImageInterface {
  imageName?: string;
  imageUrl?: string;
}
interface ImageAction {
  type: string;
  imageName?: string;
  imageUrl?: string | ArrayBuffer;
}
interface ImageUploadProps {
  image: ImageInterface;
  onSucess: (image: ImageInterface) => void;
  onReset: () => void;
  onExtCheckFailed?: () => void;
  onSizeCheckFailed?: () => void;
  onLoadError?: () => void;
}

const DEFAULT_IMAGE_PATH = '/pngs/dashboard/banner_upload_manual.png';

const BannerUpload = (props: ImageUploadProps): JSX.Element => {
  const classes = useStyle();
  const { image, onSucess, onReset, onExtCheckFailed, onSizeCheckFailed, onLoadError } = props;

  const [failed, setFailed] = useState('');
  function handleFailedReset(): void {
    setFailed('');
  }
  function handleFailed(text: string): void {
    setFailed(text);
  }
  /**
   * 파일 형식 올바르지 않은 경우의 콜백함수
   */
  function extCheckFailed(): void {
    handleFailed('업로드한 파일 형식이 올바르지 않습니다.');
  }

  /**
   * 파일 크기가 5MB를 초과하는 경우의 콜백함수
   */
  function sizeCheckFailed(): void {
    handleFailed('업로드한 파일의 크기가 5MB를 초과합니다.');
  }

  /**
   * 이미지 로드 실패 콜백함수
   */
  function loadError(): void {
    handleFailed('이미지 로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }

  const [imageLoading, setImageLoading] = useState(false);
  /**
   * 이미지 업로드 함수
   * @param event Input change React Event
   */
  const readImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onReset();
    handleFailedReset();
    setImageLoading(true);
    if (event.target.files && event.target.files.length !== 0) {
      const myImage = event.target.files[0];

      // *******************************
      // 파일 확장자 체크
      const fileRegx = /(.mp4)|(^image\/[a-zA-Z]*)$/;
      if (!fileRegx.test(myImage.type)) {
        setImageLoading(false);
        if (onExtCheckFailed) onExtCheckFailed();
        else extCheckFailed();
        return onReset();
      }
      // *******************************
      // 파일 크기 체크
      const MB_5 = 5 * 1024 * 1024; // 5kb말
      if (myImage.size > MB_5) {
        setImageLoading(false);
        if (onSizeCheckFailed) onSizeCheckFailed();
        else sizeCheckFailed();
        return onReset();
      }

      const reader = new FileReader();
      reader.readAsDataURL(myImage);
      reader.onload = (): void => {
        if (reader.result) {
          setImageLoading(false);
          onSucess({ imageName: myImage.name, imageUrl: reader.result as string });
        }
      };
      reader.onerror = (err): void => {
        console.log('error', err);
        if (onLoadError) onLoadError();
        loadError();
      };
    } else {
      setImageLoading(false);
      onReset();
    }
  };

  return (
    <div>
      <Alert severity="info" className={classes.helperText}>
        <Typography variant="body2">* 배너이미지의 배경이 있을 때 명확하게 잘 보입니다.</Typography>
        <Typography variant="body2">
          * 업로드된 배너는 방송 화면에 320 X 160 크기 (2:1비율)로 보여집니다.
        </Typography>
        <Typography variant="body2">
          * 배너 제작에 어려움이 있는 경우 배너 제작 문의 바랍니다.
        </Typography>
      </Alert>

      <div className={classes.bannerContainer}>
        {image.imageUrl && image.imageUrl === DEFAULT_IMAGE_PATH && (
          <img src={image.imageUrl} alt="" className={classes.imgPreview} />
        )}
        {image.imageUrl && image.imageUrl !== DEFAULT_IMAGE_PATH && (
          <OnadBanner
            id="preview"
            src={image.imageUrl}
            width="320"
            height="160"
            onError={(): void => {
              handleFailed('이미지를 로드하지 못했습니다. 다시 시도해보세요.');
              onReset();
            }}
            alt="배너이미지"
          />
        )}
      </div>

      {failed && <Alert severity="error">{failed}</Alert>}
      {imageLoading && <CircularProgress />}

      <div className="filebox">
        <Grid container direction="row" justify="flex-end">
          <Grid item className={classes.container}>
            <Hidden smDown>
              <input className="upload-name" value={image.imageName} disabled />
            </Hidden>
          </Grid>
          <Grid item className={classes.container}>
            <Button component="span" color="primary">
              <label htmlFor="getfile">
                <input type="file" id="getfile" accept=".mp4,image/*" onChange={readImage} />
                <Typography className={classes.imgInput}>파일찾기</Typography>
              </label>
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default BannerUpload;
