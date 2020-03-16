import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Button,
  Divider,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HOST from '../../../config';
import CustomButton from '../../../atoms/CustomButtons/Button';


const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    fontWeight: 600
  },
  button: {
    fontWeight: 800,
    width: '100%',
    fontFamily: 'Noto Sans KR',
  },
  image: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    objectPosition: 'top',
    borderRadius: '50%'
  },
  contents: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    marginBottom: theme.spacing(4),
  },
  container: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  }
}));

// TODO: 비밀번호 암호화하여 전달하기.
const RegistDialog = (props) => {
  // prop를 통해 Marketer 인지 Creator인지 확인.
  // 데이터가 변경되는 것일 때 state로 처리를 한다.
  const {
    open, handleClose,
  } = props;
  const classes = useStyles();
  // 하나의 change로 값을 받을 수 있다.

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle className={classes.title}>REGIST</DialogTitle>
      <DialogContent>
        <Grid container direction="column" className={classes.contents}>
          <Grid item>
            <CustomButton
              color="primary"
              component={Link}
              size="large"
              to="/regist"
            >
              온애드 가입하기
            </CustomButton>
          </Grid>
          <Grid item>
            <Typography style={{
              fontSize: 15, fontFamily: 'Noto Sans kr', marginTop: '20px', color: 'rgba(0, 0, 0, 0.54)', marginBottom: '3px'
            }}
            >
              소셜 계정으로 온애드 시작하기
            </Typography>
            <Divider component="hr" orientation="horizontal" />
          </Grid>
          <Grid item className={classes.buttons}>
            <Grid container direction="row">
              <Grid item>
                <Button href={`${HOST}/api/login/google`}>
                  <img src="/pngs/logo/google.png" alt="google" className={classes.image} />
                </Button>
              </Grid>
              <Grid item>
                <Button href={`${HOST}/api/login/naver`}>
                  <img src="/pngs/logo/naver2.png" alt="naver" className={classes.image} />
                </Button>
              </Grid>
              <Grid item>
                <Button href={`${HOST}/api/login/kakao`}>
                  <img src="/pngs/logo/kakao.png" alt="kakao" className={classes.image} />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>


      </DialogContent>
    </Dialog>
  );
};

export default RegistDialog;
