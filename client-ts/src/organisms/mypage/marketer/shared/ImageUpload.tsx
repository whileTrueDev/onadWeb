import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, Hidden, Typography, Button
} from '@material-ui/core';
import CustomButton from '../../../../atoms/CustomButtons/Button';


const useStyle = makeStyles((theme: Theme) => ({
  imgInput: {
    [theme.breakpoints.down('xs')]: {
      margin: '2px',
    },
    marginTop: '4px',
    fontSize: '15px',
  },
  imgPreview: {
    width: '100%',
    height: 'auto',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '200px',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '600px',
      // maxHeight: '600px',
    },
  },
  buttonSet: {
    maginTop: '16px'
  },
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
  handleClose: () => void;
  handleNext: (number: number) => () => void;
  state: ImageInterface;
  dispatch: React.Dispatch<ImageAction>;
}

const ImageUpload = (props: ImageUploadProps): JSX.Element => {
  const {
    handleClose, handleNext, state, dispatch,
  } = props;

  const classes = useStyle();

  const readImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length !== 0) {
      const fileRegx = /^image\/[a-z]*$/;
      const myImage = event.target.files[0];
      // 최대 size를 지정하자.
      if (fileRegx.test(myImage.type)) {
        const reader = new FileReader();
        reader.readAsDataURL(myImage);
        reader.onload = () => {
          if (reader.result !== null) {
            dispatch({ type: 'set', imageName: myImage.name, imageUrl: reader.result });
          }
        };
      } else {
        alert('파일의 형식이 올바르지 않습니다.');
      }
    } else {
      dispatch({ type: 'reset' });
    }
  };

  return (
    <div>
      <img
        id="preview"
        src={state.imageUrl}
        className={classes.imgPreview}
        onError={(): void => { dispatch({ type: 'reset' }); }}
        alt="이미지가 보일 영역"
      />
      <div className="filebox">
        <Grid container direction="row" justify="flex-end">
          <Grid item className={classes.container}>
            <Hidden smDown>
              <input className="upload-name" value={state.imageName} disabled />
            </Hidden>
          </Grid>
          <Grid item className={classes.container}>
            <Button component="span" color="primary">
              <label htmlFor="getfile">
                <Typography className={classes.imgInput}>
                  파일찾기
                </Typography>
              </label>
            </Button>
            <input type="file" id="getfile" accept="image/*" onChange={readImage} />
          </Grid>
        </Grid>
      </div>
      <Typography variant="h6">* 배너이미지는 배경이 존재해야 합니다.</Typography>

      <div className={classes.buttonSet}>
        <CustomButton
          size="small"
          onClick={handleClose}
        >
          취소
        </CustomButton>
        <CustomButton
          variant="contained"
          color="primary"
          size="small"
          onClick={handleNext(1)}
        >
          다음
        </CustomButton>
      </div>

    </div>

  );
};

export default ImageUpload;
