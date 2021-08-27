// material-UI
import { Grid, Button } from '@material-ui/core';
// 내부 소스
// 프로젝트 내부 모듈
import classNames from 'classnames';
import { GetStaticProps, GetStaticPropsContext, GetStaticPaths } from 'next';
import Router from 'next/router';
// 컴포넌트
import AppFooter from '../../components/mainpage/layout/appFooter';
import RePasswordDialog from '../../components/mainpage/login/rePassword';
import DefaultPolicy from '../../components/mainpage/policy/policy';
import PolicyPrivacy from '../../components/mainpage/policy/policyPrivacy';
// util 계열
import useLoginValue from '../../utils/hooks/useLoginValue';
// 스타일
import useStyles from '../../styles/mainpage/policy/policy.style';

interface PolicyProps {
  params: string;
}

export default function Policy({ params }: PolicyProps): JSX.Element {
  const { repasswordOpen, logout, setRepassword } = useLoginValue();
  const privacy = params;
  const classes = useStyles();

  return (
    <div>
      <a href="/" className={classes.logo}>
        <img src="/logo/textLogo.png" alt="textlogo" className={classes.logo} />
      </a>
      <div className={classes.root}>
        <div className={classes.contentBox}>
          <Grid container direction="row" alignItems="center" justifyContent="flex-start">
            <Grid item>
              <Button
                className={classNames({
                  [classes.buttonPrivacy]: privacy,
                  [classes.button]: !privacy,
                })}
                color="secondary"
                onClick={() => Router.push('/policy/main')}
              >
                이용약관
              </Button>
              <Button
                className={classNames({
                  [classes.buttonPrivacy]: !privacy,
                  [classes.button]: privacy,
                })}
                color="secondary"
                onClick={() => Router.push('/policy/privacy')}
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

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [{ params: { policy: 'main' } }, { params: { policy: 'privacy' } }];

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
  if (ctx.params?.policy === 'main') {
    return {
      props: {
        params: '',
      },
    };
  }

  return {
    props: {
      params: 'privacy',
    },
  };
};
