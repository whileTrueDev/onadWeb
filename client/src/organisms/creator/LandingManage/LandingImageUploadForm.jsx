import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '../../../atoms/CustomButtons/Button';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
import useImageUpload from '../../../utils/lib/hooks/useImageUpload';
import useDialog from '../../../utils/lib/hooks/useDialog';
import CustomCard from '../../../atoms/CustomCard';
import StyledItemText from '../../../atoms/StyledItemText';

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
    margin: 0,
    padding: theme.spacing(1),
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      margin: '2px',
      width: 235
    },
    [theme.breakpoints.up('xl')]: {
      padding: theme.spacing(2)
    },
  },
}));

const defaultImage = '/pngs/landing/background-whale.jpg';

// 배경이미지 업로드, 기본이미지로 돌아가기 button
const Buttons = (props) => {
  const {
    imageUrl, userImage, handleUploadClick, handleImageChange
  } = props;
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Button
        color="info"
        disabled={imageUrl === userImage}
        onClick={() => { handleUploadClick(); }}
      >
            변경 저장하기
      </Button>

      <Button
        color="warning"
        disabled={imageUrl === defaultImage}
        onClick={() => { handleImageChange({ newImageUrl: defaultImage }); }}
      >
            기본 이미지로
      </Button>
    </div>
  );
};

export default function LandingImageUploadForm(props) {
  const { userData } = props;
  const isLgWidth = useMediaQuery('(min-width:1200px)');
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
    <CustomCard
      iconComponent={<StyledItemText primary="배경이미지 업로드" style={{ color: '#fff' }} />}
      buttonComponent={isLgWidth && (
      <Buttons
        imageUrl={imageUrl}
        userImage={userImage}
        handleUploadClick={handleUploadClick}
        handleImageChange={handleImageChange}
      />
      )}
    >
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

      {!isLgWidth && (
      <Buttons
        imageUrl={imageUrl}
        userImage={userImage}
        handleUploadClick={handleUploadClick}
        handleImageChange={handleImageChange}
      />
      )}

      <Snackbar
        open={snack.open}
        message="이미지가 등록되었습니다."
        handleClose={snack.handleClose}
      />
    </CustomCard>
  );
}

LandingImageUploadForm.propTypes = {
  userData: PropTypes.object.isRequired
};
