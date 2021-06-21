import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Button,
  Divider,
  Typography,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useStyles from './style/RegistDialog.style';
import HOST from '../../../config';
import CustomButton from '../../../atoms/CustomButtons/Button';

interface Props {
  open: boolean;
  handleClose: () => void;
}
// TODO: 비밀번호 암호화하여 전달하기.
const RegistDialog = ({ open, handleClose }: Props) => {
  // prop를 통해 Marketer 인지 Creator인지 확인.
  // 데이터가 변경되는 것일 때 state로 처리를 한다.
  const classes = useStyles();
  const theme = useTheme();
  // 하나의 change로 값을 받을 수 있다.

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle className={classes.title}>광고주 회원가입</DialogTitle>
      <DialogContent>
        <Grid container direction="column" className={classes.contents}>
          <Grid item>
            <CustomButton
              color="primary"
              style={{ color: theme.palette.common.white }}
              link={Link}
              size="large"
              to="/regist"
            >
              온애드 가입하기
            </CustomButton>
          </Grid>
          <Grid item>
            <Typography
              color="textSecondary"
              style={{
                marginTop: 16,
                marginBottom: '3px',
              }}
            >
              소셜 계정으로 온애드 시작하기
            </Typography>
            <Divider component="hr" orientation="horizontal" />
          </Grid>
          <Grid item className={classes.buttons}>
            <Grid container direction="row">
              <Grid item>
                <Button href={`${HOST}/login/google`}>
                  <img src="/pngs/logo/google.png" alt="google" className={classes.image} />
                </Button>
              </Grid>
              <Grid item>
                <Button href={`${HOST}/login/naver`}>
                  <img src="/pngs/logo/naver2.png" alt="naver" className={classes.image} />
                </Button>
              </Grid>
              <Grid item>
                <Button href={`${HOST}/login/kakao`}>
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
