import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

import Button from '../../../components/CustomButtons/Button';
import Snackbar from '../../../components/Snackbar/Snackbar';
import useImageUpload from '../../../lib/hooks/useImageUpload';
import useDialog from '../../../lib/hooks/useDialog';
import history from '../../../../../history';

const useStyles = makeStyles(theme => ({
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: 550,
    '&:hover': {
      zIndex: 1,
    },
    '&:hover $imageButton': {
      opacity: 1
    }
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  imageButton: {
    transition: theme.transitions.create('opacity'),
    opacity: 0,
    [theme.breakpoints.down('xs')]: {
      margin: '2px',
    },
    margin: 0,
    textAlign: 'center',
  },
}));

const defaultImage = '/pngs/landing/background-whale.jpg';

export default function LandingImageUploadForm(props) {
  const { userData } = props;
  const classes = useStyles();
  const snack = useDialog();
  const url = '/api/dashboard/creator/landing/image/upload';
  const userImage = !userData.payload.creatorBackgroundImage
    ? defaultImage
    : userData.payload.creatorBackgroundImage;
  const {
    imageUrl, readImage, handleImageChange, handleUploadClick
  } = useImageUpload(userImage, url, snack.handleOpen, userData.callUrl);


  return (
    <div>
      <div
        className={classes.imageWrapper}
        htmlFor="getfile"
      >
        <div
          className={classes.imageSrc}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        <div>
          <Button className={classes.imageButton} component="label" size="lg" color="info">
            <input
              style={{ padding: 0 }}
              type="file"
              id="getfile"
              accept="image/*"
              onChange={(e) => { readImage(e); }}
            />
          </Button>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          color="info"
          disabled={imageUrl === userImage}
          onClick={() => {
            handleUploadClick();
            // history.push(window.location.pathname);
          }}
        >
            변경 저장하기
        </Button>

        <Button
          color="warning"
          disabled={imageUrl === defaultImage}
          onClick={() => {
            handleImageChange({ newImageUrl: defaultImage });
            console.log(imageUrl);
          }}
        >
            기본 이미지로
        </Button>
      </div>

      <Snackbar
        open={snack.open}
        message="이미지가 등록되었습니다."
        handleClose={snack.handleClose}
      />
    </div>
  );
}

LandingImageUploadForm.propTypes = {
  userData: PropTypes.object.isRequired
};
