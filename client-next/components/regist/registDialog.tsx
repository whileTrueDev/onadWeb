// material-UI
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
// 내부 소스
import { useRouter } from 'next/router';
import Image from 'next/image';
import googleLogo from '../../public/logo/google/google.png';
import naverLogo from '../../public/logo/naver/naver2.png';
import kakaoLogo from '../../public/logo/kakao/kakao.png';
// 프로젝트 내부 모듈
// 컴포넌트
import CustomButton from '../../atoms/button/customButton';
// util 계열
import HOST from '../../config';
// 스타일
import useStyles from '../../styles/regist/registDialog.style';

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
  const router = useRouter();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle className={classes.title}>광고주 회원가입</DialogTitle>
      <DialogContent>
        <Grid container direction="column" className={classes.contents}>
          <Grid item>
            <CustomButton
              color="primary"
              style={{ color: theme.palette.common.white }}
              size="large"
              onClick={() => {
                router.push({
                  pathname: '/regist/[regist]',
                  query: { regist: 'main' },
                });
              }}
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
                <Button
                  onClick={() => {
                    router.push(`${HOST}/login/google`);
                  }}
                >
                  <Image
                    src={googleLogo}
                    alt="googleLogo"
                    className={classes.image}
                    height={50}
                    width={50}
                  />
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => {
                    router.push(`${HOST}/login/naver`);
                  }}
                >
                  <Image
                    src={naverLogo}
                    alt="naverLogo"
                    className={classes.image}
                    height={50}
                    width={50}
                  />
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => {
                    router.push(`${HOST}/login/kakao`);
                  }}
                >
                  <Image
                    src={kakaoLogo}
                    alt="kakaoLogo"
                    className={classes.image}
                    height={50}
                    width={50}
                  />
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
