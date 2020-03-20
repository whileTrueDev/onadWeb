import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button as UploadButton, Typography, Grid } from '@material-ui/core';
import Button from '../../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import useImageUpload from '../../../../../utils/hooks/useImageUpload';
import usePutRequest from '../../../../../utils/hooks/usePutRequest';

const useStyles = makeStyles((theme) => ({
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
      maxHeight: '550px',
    },
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface BusinessRegiUploadDialogProps {
  open: boolean;
  handleClose: () => void;
  businessRegiImage: string;
  request: () => void;
  handleSnackOpen: () => void;
}

export default function BusinessRegiUploadDialog(
  props: BusinessRegiUploadDialogProps
): JSX.Element {
  const {
    open, handleClose, businessRegiImage, request, handleSnackOpen
  } = props;
  const classes = useStyles();

  const defaultImage = businessRegiImage || '/pngs/logo/onad_logo_vertical_small.png';

  const {
    imageUrl, imageName, handleReset, readImage
  } = useImageUpload(defaultImage);

  const imageUpload = usePutRequest('/marketer/business', () => {
    handleSnackOpen();
    request();
  });

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
            color="primary"
            onClick={async (): Promise<void> => {
              await imageUpload.doPutRequest({ imageUrl });
              await handleClose();
            }}
            disabled={!imageName}
          >
            진행
          </Button>
          <Button onClick={(): void => { handleClose(); handleReset(); }}>
            취소
          </Button>
        </div>
      )}
    >
      <div>

        <img
          id="preview"
          src={(typeof imageUrl === 'string') ? imageUrl : undefined}
          className={classes.imgPreview}
          onError={handleReset}
          alt="business-registration-preview"
        />

        <div className="filebox">
          <Grid container direction="row" justify="flex-end">
            <Grid item className={classes.container}>
              {/* <Hidden smDown> */}
              <input className="upload-name" value={imageName || ''} disabled />
              {/* </Hidden> */}
            </Grid>
            <Grid item className={classes.container}>
              <UploadButton component="span" color="primary">
                <label htmlFor="getfile">
                  <Typography className={classes.imgInput}>
                    파일찾기
                  </Typography>
                </label>
              </UploadButton>
              <input type="file" id="getfile" accept="image/*" onChange={readImage} />
            </Grid>
          </Grid>
        </div>
      </div>
    </Dialog>
  );
}
