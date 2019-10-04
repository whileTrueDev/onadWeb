import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../atoms/Dialog/Dialog';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import useImageUpload from '../../../../utils/lib/hooks/useImageUpload';

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


export default function BusinessRegiUploadDialog(props) {
  const {
    open, handleClose, businessRegiImage, request, handleSnackOpen
  } = props;
  const classes = useStyles();
  const {
    imageUrl, imageName, handleReset, readImage, handleUploadClick
  } = useImageUpload(businessRegiImage,
    '/api/dashboard/marketer/profile/business/upload',
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
              await handleUploadClick();
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
