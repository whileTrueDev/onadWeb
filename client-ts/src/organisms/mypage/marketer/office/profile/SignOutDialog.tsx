import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '../../../../../atoms/CustomButtons/Button';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.action.disabledBackground,
    fontSize: 20,
  },
  contents: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.error.light,
    fontSize: 20,
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
          <p>회원탈퇴를 하시면, 아래 정보들이 삭제됩니다.</p>
          <p>
            또한 해당 아이디
            {' '}
            (
            <span style={{ color: 'red' }}>
              {marketerId}
            </span>
            )
            {' '}
            로 본인 또는 타인의 재가입이 불가능합니다.
          </p>
        </div>
        <Typography className={classes.contents}>
          이름, 비밀번호, 메일, 전화번호, 사업자 등록번호, 계좌정보,
          사업자 등록증 이미지, 개인식별자, 등록한 배너, 등록한 캠페인, 충전된 캐시
        </Typography>

        <div style={{ float: 'right', padding: 8 }}>
          <Button color="primary" onClick={handleOpen}>
            취소
          </Button>
          <Button
          // color="danger"
            onClick={(): void => {
              if (window.confirm('정말로 탈퇴하십니까?')) {
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