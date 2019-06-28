import React, { useState } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';
import CustomButton from '../../../components/CustomButtons/Button';
import './upload.css';


const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  head: {
    fontSize: '20px',
    fontWeight: '600',
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h5" className={classes.head}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },

}))(MuiDialogContent);

const dialogStyle = {
  reason: {
    marginTop: '10px',
    margin: '7px',
    fontSize: '16px',
    fontWeight: '500',
  },
  company: {
    marginTop: '10px',
    textAlign: 'left',
    margin: '7px',
    fontSize: '20px',
    fontWeight: '700',
  },
  time: {
    textAlign: 'right',
  },
  body: {
    textAlign: 'center',
    fontSize: '20px',
  },
  input: {
    fontSize: '20px',
  },
};

const UploadDialog = (props) => {
  const {
    open, handleOpen, classes, readyBanner,
  } = props;
  const [imageName, setName] = useState('');
  const [url, setUrl] = useState('');

  const readImage = (event) => {
    // if (input.files && input.files[0]) {
    const fileList = event.target.files;
    // 읽기
    if (fileList) {
      const reader = new FileReader();
      reader.readAsDataURL(fileList[0]);
      reader.onload = () => {
        setUrl(reader.result);
        setName(fileList[0].name);
      };
    }
  };

  const handleClose = () => {
    setName('');
    setUrl('');
    readyBanner();
    handleOpen();
  };

  const handleError = (e) => {
    e.target.src = '/images/captain.jpg';
  };

  // url을 제출.
  const handleSubmit = () => {
    if (url) {
      axios.post('/dashboard/marketer/banner/push', { url })
        .then((res) => {
          alert(res.data[1]);
          handleClose();
        });
    } else {
      alert('파일을 선택하지 않았습니다.');
    }
  };


  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      disableBackdropClick
    >
      <DialogTitle onClose={handleClose}>
            배너 등록
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <img id="preview" src={url} width="600" height="400" onError={handleError} alt="이미지가 보일 영역" />
        </Typography>
        <div className="filebox">
          <input className="upload-name" value={imageName} disabled="disabled" />
          <label htmlFor="getfile">파일찾기
            <input type="file" id="getfile" accept="image/*" onChange={readImage} className={classes.input} />
          </label>
        </div>
        <Divider />
        <div className={classes.company}>
          <CustomButton color="warning" size="lg" onClick={handleSubmit}>업로드</CustomButton>
        </div>
        <Typography gutterBottom className={classes.time} />
      </DialogContent>
    </Dialog>
  );
};

export default withStyles(dialogStyle)(UploadDialog);
