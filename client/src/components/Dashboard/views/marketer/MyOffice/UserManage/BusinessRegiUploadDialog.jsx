import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '../../../../components/CustomButtons/Button';
import Dialog from '../../../../components/Dialog/Dialog';
import GridContainer from '../../../../components/Grid/GridContainer';
import GridItem from '../../../../components/Grid/GridItem';
import axios from '../../../../../../utils/axios';
import HOST from '../../../../../../config';

const useStyles = makeStyles(theme => ({
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
      maxHeight: '550px',
    },
  },
}));


function useImageUpload(DEFAULT_IMAGE, url, snackOpenFunction) {
  const [imageUrl, setImageUrl] = React.useState(DEFAULT_IMAGE);
  const [imageName, setImageName] = React.useState('');
  function handleReset() {
    setImageName('');
    setImageUrl(DEFAULT_IMAGE);
  }
  function handleImageChange({ newImageName, newImageUrl }) {
    setImageName(newImageName);
    setImageUrl(newImageUrl);
  }

  const readImage = (event) => {
    if (event.target.files.length !== 0) {
      const fileRegx = /^image\/[a-z]*$/;
      const myImage = event.target.files[0];
      // 최대 size를 지정하자.
      if (fileRegx.test(myImage.type)) {
        const reader = new FileReader();
        reader.readAsDataURL(myImage);
        reader.onload = () => {
          handleImageChange({ newImageName: myImage.name, newImageUrl: reader.result });
        };
      } else {
        alert('파일의 형식이 올바르지 않습니다.');
      }
    } else {
      handleReset();
    }
  };

  function handleClick() {
    axios.post(url, {
      imageUrl, imageName
    })
      .then((res) => {
        if (res.data[0]) {
          snackOpenFunction();
        } else {
          alert('현재는 등록할 수 없습니다. 본사에 문의하세요');
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
    handleClick
  };
}

export default function BusinessRegiUploadDialog(props) {
  const {
    open, handleClose, businessRegiImage, request, handleSnackOpen
  } = props;
  const classes = useStyles();
  const {
    imageUrl, imageName, handleReset, readImage, handleClick
  } = useImageUpload(businessRegiImage,
    `${HOST}/api/dashboard/marketer/profile/business/upload`,
    handleSnackOpen);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={businessRegiImage ? '사업자 등록증 재업로드' : '사업자 등록증 업로드'}
      maxWidth="sm"
      fullWidth
      buttons={(
        <div>
          <Button
            color="info"
            onClick={async () => {
              await handleClick();
              await handleClose();
              request();
            }}
            disabled={!imageName}
          >
              진행
          </Button>
          <Button onClick={() => { handleClose(); handleReset(); }}>
              취소
          </Button>
        </div>
      )}
    >
      <div className={classes.contentWrapper}>

        <img
          id="preview"
          src={imageUrl}
          className={classes.imgPreview}
          onError={handleReset}
          alt="business-registration-preview"
        />

        <div className="filebox">
          <GridContainer justify="flex-end">
            <GridItem>
              {/* <Hidden smDown> */}
              <input className="upload-name" value={imageName} disabled="disabled" />
              {/* </Hidden> */}
            </GridItem>
            <GridItem>
              <Button component="label" color="info" size="sm" htmlFor="getfile" className={classes.imgInput}>
                파일찾기
                <input type="file" id="getfile" accept="image/*" onChange={readImage} />
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </Dialog>
  );
}

BusinessRegiUploadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  businessRegiImage: PropTypes.string,
  request: PropTypes.func.isRequired,
  handleSnackOpen: PropTypes.func.isRequired
};

BusinessRegiUploadDialog.defaultProps = {
  businessRegiImage: '/pngs/logo/onad_logo_vertical_small.png'
};
