import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, Hidden, Typography, Button
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import OnadBanner from '../../../../atoms/Banner/OnadBanner';


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
  state: ImageInterface;
  dispatch: React.Dispatch<ImageAction>;
}

const ImageUpload = (props: ImageUploadProps): JSX.Element => {
  const {
    state, dispatch,
  } = props;

  const classes = useStyle();

  const readImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length !== 0) {
      const fileRegx = /(.mp4)|(^image\/[a-z]*)$/;
      const myImage = event.target.files[0];
      // 최대 size를 지정하자.
      if (fileRegx.test(myImage.type)) {
        const reader = new FileReader();
        reader.readAsDataURL(myImage);
        reader.onload = (): void => {
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
      {state.imageUrl && (
        <OnadBanner
          id="preview"
          src={state.imageUrl}
          className={classes.imgPreview}
          width="320"
          height="160"
          onError={(): void => { dispatch({ type: 'reset' }); }}
          alt="배너이미지"
        />
      )}
      <Alert severity="info">
        <Typography>배너이미지의 배경이 있을 때 명확하게 잘 보입니다.</Typography>
      </Alert>
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
            <input type="file" id="getfile" accept=".mp4,image/*" onChange={readImage} />
          </Grid>
        </Grid>
      </div>

    </div>

  );
};

export default ImageUpload;
