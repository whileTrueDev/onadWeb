// material-UI
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
// 내부 소스
// 프로젝트 내부 모듈
import { useEffect } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
// 컴포넌트
import AppFooter from '../components/layout/appFooter';
import RePasswordDialog from '../components/login/rePassword';
import DefaultPolicy from '../components/main/policy/policy';
import PolicyPrivacy from '../components/main/policy/policyPrivacy';
// util 계열
import useLoginValue from '../utils/hooks/useLoginValue';
// 스타일
import useStyles from '../styles/policy/policy.style';

interface PolicyProps {
  match: { params: { privacy: string } };
}

export default function Policy({ match }: PolicyProps): JSX.Element {
  const { repasswordOpen, logout, setRepassword } = useLoginValue();

  const { privacy } = match.params;
  const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <a href="/" className={classes.logo}>
        <img src="/logo/textLogo.png" alt="textlogo" className={classes.logo} />
      </a>
      <div className={classes.root}>
        <div className={classes.contentBox}>
          <Grid container direction="row" alignItems="center" justify="flex-start">
            <Grid item>
              <Button
                className={classNames({
                  [classes.buttonPrivacy]: privacy,
                  [classes.button]: !privacy,
                })}
                component={Link}
                color="secondary"
                to="/policy"
              >
                이용약관
              </Button>
              <Button
                className={classNames({
                  [classes.buttonPrivacy]: !privacy,
                  [classes.button]: privacy,
                })}
                component={Link}
                color="secondary"
                to="/policy/privacy"
              >
                개인정보 처리방침
              </Button>
            </Grid>
          </Grid>
          <Grid container>{privacy ? <PolicyPrivacy /> : <DefaultPolicy />}</Grid>
        </div>
      </div>
      <AppFooter />
      <RePasswordDialog
        repasswordOpen={repasswordOpen}
        setRepassword={setRepassword}
        logout={logout}
      />
    </div>
  );
}
