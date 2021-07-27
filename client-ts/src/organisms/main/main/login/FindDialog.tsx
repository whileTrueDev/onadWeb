import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import * as React from 'react';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import HOST from '../../../../config';
import axios from '../../../../utils/axios';
import { useMarketerUpdateTmpPassword } from '../../../../utils/hooks/mutation/useMarketerUpdateTmpPassword';
import style from '../style/FindDialog.style';

interface Props {
  dialogType: string;
  findDialogOpen: boolean;
  handleFindDialogClose: () => void;
  handleClose: () => void;
}

const initialState = {
  marketerName: '',
  marketerMail: '',
  marketerId: '',
};

const FindResult: any = initialState;

type InputType = React.ChangeEvent<HTMLInputElement>;
type FormType = React.FormEvent<HTMLFormElement>;

function FindDialog({
  dialogType,
  findDialogOpen,
  handleFindDialogClose,
  handleClose,
}: Props): JSX.Element {
  const classes = style();
  const [findContent, setFindContent] = React.useState(initialState);

  function onChange(e: InputType): void {
    const { name, value } = e.currentTarget;
    FindResult[name] = value;
    setFindContent(FindResult);
  }
  const CheckId = (event: FormType) => {
    event.preventDefault();
    const emailReg =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*[.]+[a-zA-Z]{2,3}$/i;
    if (emailReg.test(findContent.marketerMail)) {
      axios
        .get(`${HOST}/marketer/id`, { params: findContent })
        .then(res => {
          const ans = JSON.parse(res.data);
          if (ans.error) {
            alert(ans.message);
            setFindContent(initialState);
          } else {
            alert(`당신의 ID는 ${ans.message} 입니다.`);
            handleFindDialogClose();
            setFindContent(initialState);
          }
        })
        .catch(err => {
          console.log(err);
          handleFindDialogClose();
          setFindContent(initialState);
        });
    } else {
      // 이메일 형식 오류
      alert('이메일 형식이 올바르지 않습니다.');
      setFindContent(initialState);
    }
  };

  const tmpPwMutation = useMarketerUpdateTmpPassword();
  const CheckPasswd = (event: FormType) => {
    event.preventDefault();
    const emailReg =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*[.]+[a-zA-Z]{2,3}$/i;
    if (emailReg.test(findContent.marketerMail)) {
      tmpPwMutation.mutateAsync(findContent).then(res => {
        if (res.data.error) {
          alert(res.data.message);
          setFindContent(initialState);
        } else {
          alert('가입시 등록한 이메일로 임시비밀번호가 발송되었습니다.');
          handleFindDialogClose();
          handleClose();
          setFindContent(initialState);
        }
      });
    } else {
      // 이메일 형식 오류
      alert('이메일 형식이 올바르지 않습니다.');
      setFindContent(initialState);
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
            ONAD에 등록시에 입력하였던 아이디와 이메일을 입력하세요.
          </DialogContentText>
          <TextField
            required
            label="아이디"
            helperText="비밀번호를 찾을 아이디를 입력하세요."
            margin="dense"
            onChange={onChange}
            name="marketerId"
            InputLabelProps={{ shrink: true }}
            style={{ width: '80%' }}
          />
          <TextField
            required
            label="이메일"
            helperText="가입시 입력한 이메일을 입력하세요."
            margin="dense"
            onChange={onChange}
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
          ONAD에 등록시에 입력하였던 이름와 이메일을 입력하세요.
        </DialogContentText>
        <TextField
          required
          label="이름"
          helperText="가입시 입력한 이름을 입력하세요."
          margin="dense"
          onChange={onChange}
          name="marketerName"
          InputLabelProps={{ shrink: true }}
          style={{ width: '80%' }}
        />
        <TextField
          required
          label="이메일"
          helperText="가입시 입력한 이메일을 입력하세요."
          margin="dense"
          onChange={onChange}
          name="marketerMail"
          InputLabelProps={{ shrink: true }}
          style={{ width: '80%' }}
        />
      </DialogContent>
    );
  };

  return (
    <Dialog open={findDialogOpen} maxWidth="sm" fullWidth>
      <DialogTitle>아이디/비밀번호 찾기</DialogTitle>
      <form onSubmit={handleSubmit()}>
        {tmpPwMutation.isLoading ? <CenterLoading /> : <Content />}
        <DialogActions>
          <Button type="submit" value="Submit" color="primary" disabled={tmpPwMutation.isLoading}>
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
