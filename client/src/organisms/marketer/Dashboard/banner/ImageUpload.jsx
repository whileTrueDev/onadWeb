import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Hidden } from '@material-ui/core';
import CustomButton from '../../../../atoms/CustomButtons/Button';


const ImageUploadgStyle = theme => ({
  imgInput: {
    [theme.breakpoints.down('xs')]: {
      margin: '2px',
    },
    margin: 0,
    textAlign: 'center',
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
});

const ImageUpload = (props) => {
  const {
    handleClose, handleNext, state, dispatch, classes,
  } = props;


  const readImage = (event) => {
    if (event.target.files.length !== 0) {
      const fileRegx = /^image\/[a-z]*$/;
      const myImage = event.target.files[0];
      // 최대 size를 지정하자.
      if (fileRegx.test(myImage.type)) {
        const reader = new FileReader();
        reader.readAsDataURL(myImage);
        reader.onload = () => {
          dispatch({ type: 'set', imageName: myImage.name, imageUrl: reader.result });
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
        onError={() => { dispatch({ type: 'reset' }); }}
        alt="이미지가 보일 영역"
      />
      <div className="filebox">
        <Grid container direction="row" justify="flex-end">
          <Grid item>
            <Hidden smDown>
              <input className="upload-name" value={state.imageName} disabled="disabled" />
            </Hidden>
          </Grid>
          <Grid item>
            <CustomButton component="label" color="info" size="sm" htmlFor="getfile" className={classes.imgInput}>
                파일찾기
              <input type="file" id="getfile" accept="image/*" onChange={readImage} />
            </CustomButton>
          </Grid>
        </Grid>
      </div>

      <div style={{ maginTop: '16px' }}>
        <CustomButton
          size="sm"
          onClick={handleClose}
        >
              취소
        </CustomButton>
        <CustomButton
          variant="contained"
          color="info"
          size="sm"
          onClick={handleNext(1)}
        >
              다음
        </CustomButton>
      </div>

    </div>

  );
};


ImageUpload.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withStyles(ImageUploadgStyle)(ImageUpload);
