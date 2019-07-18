import React, { useReducer } from 'react';
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
import HOST from '../../../../../config';
import axios from '../../../../../utils/axios';


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

const DEFAULT_IMAGE_PATH = '/pngs/onad_logo.jpg';

const myReducer = (state, action) => {
  switch (action.type) {
    case 'reset': {
      return { imageName: '', imageUrl: DEFAULT_IMAGE_PATH };
    }
    case 'set': {
      return { imageName: action.imageName, imageUrl: action.imageUrl };
    }
    default: {
      console.log('잘못된 사용입니다');
      return state;
    }
  }
};

const UploadDialog = (props) => {
  const {
    open, handleOpen, classes, readyBanner,
  } = props;
  const [state, dispatch] = useReducer(myReducer, { imageName: '', imageUrl: DEFAULT_IMAGE_PATH });

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

  const handleClose = () => {
    dispatch({ type: 'reset' });
    readyBanner();
    handleOpen();
  };


  // url을 제출.
  const handleSubmit = () => {
    if (state.imageUrl !== DEFAULT_IMAGE_PATH) {
      axios.post(`${HOST}/api/dashboard/marketer/banner/push`, { url: state.imageUrl })
        .then((res) => {
          if (res.data[0]) {
            alert(res.data[1]);
          } else {
            alert('현재는 등록할 수 없습니다. 본사에 문의하세요');
          }
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
          <img id="preview" src={state.imageUrl} width="600" height="400" onError={() => { dispatch({ type: 'reset' }); }} alt="이미지가 보일 영역" />
        </Typography>
        <div className="filebox">
          <input className="upload-name" value={state.imageName} disabled="disabled" />
          <label htmlFor="getfile">
            파일찾기
            <input type="file" id="getfile" accept="image/*" onChange={readImage} className={classes.input} />
          </label>
        </div>
        <Divider />
        <div className={classes.company}>
          <CustomButton color="info" size="lg" onClick={handleSubmit}>업로드</CustomButton>
        </div>
        <Typography gutterBottom className={classes.time} />
      </DialogContent>
    </Dialog>
  );
};

export default withStyles(dialogStyle)(UploadDialog);
