import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import axios from '../../../../../utils/axios';
import HOST from '../../../../../config';

const style = makeStyles(() => ({
  contents: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
  },
  contentText: {
    fontSize: 13,
  },
}));

interface Props {
  dialogType: string;
  findDialogOpen: boolean;
  handleFindDialogClose: () => void;
  handleClose: () => void;
}

function FindDialog({
  dialogType,
  findDialogOpen,
  handleFindDialogClose,
  handleClose,
}: Props): JSX.Element {
  const CheckId = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let mailInput = event.currentTarget.marketerMail;
    const user = {
      marketerName: event.currentTarget.marketerName,
      marketerMail: event.currentTarget.marketerMail,
    };
    const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*[.]+[a-zA-Z]{2,3}$/i;
    if (emailReg.test(user.marketerMail)) {
      axios.post(`${HOST}/api/regist/findId`, user)
        .then((res) => {
          if (res.data.error) {
            alert(res.data.message);
            mailInput = '';
          } else {
            alert(`당신의 ID는 ${res.data.message} 입니다.`);
            handleFindDialogClose();
          }
        })
        .catch((err) => {
          console.log(err);
          handleFindDialogClose();
        });
    } else {
      // 이메일 형식 오류
      alert('이메일 형식이 올바르지 않습니다.');
      mailInput.value = '';
    }
  };

  const classes = style();

  const CheckPasswd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*[.]+[a-zA-Z]{2,3}$/i;
    let mailInput = event.currentTarget.marketerMail;
    const user = {
      marketerId: event.currentTarget.marketerId,
      marketerMail: event.currentTarget.marketerMail,
    };
    if (emailReg.test(user.marketerMail)) {
      axios.post(`${HOST}/api/regist/findPw`, user)
        .then((res) => {
          if (res.data.error) {
            alert(res.data.message);
            mailInput = '';
            // handleFindDialogClose();
            // handleClose();
          } else {
            alert('가입시 등록한 이메일로 임시비밀번호가 발송되었습니다.');
            handleFindDialogClose();
            handleClose();
          }
        });
    } else {
      // 이메일 형식 오류
      alert('이메일 형식이 올바르지 않습니다.');
    }
  };

  const handleSubmit = () => {
    if (dialogType === 'PASSWORD') {
      return CheckPasswd;
    }
    return CheckId;
  };

  const Content = () => {
    if (dialogType === 'PASSWORD') {
      return (
        <DialogContent className={classes.contents}>
          <DialogContentText className={classes.contentText}>
            ONAD에 등록시에 입력하였던 ID와 EMAIL을 입력하세요.
          </DialogContentText>
          <TextField
            required
            label="ID"
            helperText="ID을 입력하세요."
            margin="dense"
            name="marketerId"
            InputLabelProps={{ shrink: true }}
            style={{ width: '80%' }}
          />
          <TextField
            required
            label="EMAIL"
            helperText="EMAIL을 입력하세요."
            margin="dense"
            name="marketerMail"
            id="mail"
            InputLabelProps={{ shrink: true }}
            style={{ width: '80%' }}
          />
        </DialogContent>
      );
    }
    return (
      <DialogContent className={classes.contents}>
        <DialogContentText className={classes.contentText}>
          ONAD에 등록시에 입력하였던 NAME와 EMAIL을 입력하세요.
        </DialogContentText>
        <TextField
          required
          label="NAME"
          helperText="이름을 입력하세요."
          margin="dense"
          name="marketerName"
          InputLabelProps={{ shrink: true }}
          style={{ width: '80%' }}
        />
        <TextField
          required
          label="EMAIL"
          helperText="EMAIL을 입력하세요."
          margin="dense"
          name="marketerMail"
          InputLabelProps={{ shrink: true }}
          style={{ width: '80%' }}
        />
      </DialogContent>
    );
  };

  return (
    <Dialog
      open={findDialogOpen}
      maxWidth="sm"
    >
      <DialogTitle>Find ID/PW</DialogTitle>
      <form onSubmit={handleSubmit()}>
        <Content />
        <DialogActions>
          <Button type="submit" value="Submit" color="primary">
            확인
          </Button>
          <Button color="primary" onClick={handleFindDialogClose}>
            취소
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}


export default FindDialog;
