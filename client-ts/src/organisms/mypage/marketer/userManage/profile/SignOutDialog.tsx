import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Alert } from '@material-ui/lab';
import Button from '../../../../../atoms/CustomButtons/Button';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
}));

interface SignOutDialogProps {
  handleOpen: () => void;
  open: boolean;
  marketerId: string;
  signOutFunc: () => void;
}

const SignOutDialog = (props: SignOutDialogProps): JSX.Element => {
  const {
    handleOpen, open, marketerId, signOutFunc
  } = props;
  const classes = useStyles();
  return (
    <Dialog onClose={handleOpen} open={open}>
      <Paper>
        <div className={classes.container}>
          <Typography>회원 탈퇴를 진행하시면, 광고 캐시를 포함한 유저 정보가 모두 삭제처리 됩니다.</Typography>
          <Typography>
            또한 해당 아이디
            {' '}
            (
            <Typography component="span" color="error">{marketerId}</Typography>
            )
            {' '}
            로 본인 또는 타인의 재가입이 불가능합니다.
          </Typography>
        </div>

        <Alert severity="error">
          <Typography>
            이름, 비밀번호, 메일, 전화번호, 사업자 등록번호, 계좌정보,
            사업자 등록증 이미지, 개인식별자, 등록한 배너, 등록한 캠페인, 충전된 캐시
          </Typography>
        </Alert>

        <div style={{ float: 'right', padding: 8 }}>
          <Button color="primary" onClick={handleOpen}>
            취소
          </Button>
          <Button
          // color="danger"
            onClick={(): void => {
              if (window.confirm('정말로 탈퇴를 진행하시겠습니까?')) {
                signOutFunc();
              } else {
              // 취소시 다이얼로그 꺼지게
                handleOpen();
              }
            }}
          >
            탈퇴하기
          </Button>
        </div>
      </Paper>
    </Dialog>
  );
};

export default SignOutDialog;
