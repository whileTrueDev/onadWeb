import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Dialog from '../../../../../atoms/Dialog/Dialog';

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

const BusinessViewDialog = (props: BusinessRegiUploadDialogProps): JSX.Element => {
  const { open, handleClose, businessRegiImage } = props;
  const classes = useStyles();
  const defaultImage = '/pngs/logo/onad_logo_vertical_small.png';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <div>
        <img
          className={classes.imgPreview}
          id="preview"
          src={(typeof businessRegiImage === 'string' && businessRegiImage.indexOf('pdf') === -1) ? businessRegiImage : defaultImage}
          alt="business-registration-preview"
        />
        {businessRegiImage.indexOf('pdf') !== -1 && (
          <span>
            PDF파일은 미리보기를 지원하지 않습니다.
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default BusinessViewDialog;
