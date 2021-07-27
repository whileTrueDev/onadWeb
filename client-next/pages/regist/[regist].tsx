// material-UI
import makeStyles from '@material-ui/core/styles/makeStyles';
// 내부 소스
// 프로젝트 내부 모듈
import { GetStaticProps, GetStaticPropsContext, GetStaticPaths } from 'next'
import {useRouter} from 'next/router'
// 컴포넌트
import NavTop from '../../components/layout/navTop';
import RegistStepper from '../../components/regist/stepper';
import SignupCreator from '../../components/signup-creator/signupCreator';
// util 계열
import useLoginValue from '../../utils/hooks/useLoginValue';
// 스타일

const useStyles = makeStyles(theme => ({
  rootMarketer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  rootCreator: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
  }
}));

interface Props {
  params: string
}

export default function Regist({ params }: Props): JSX.Element {
  const classes = useStyles();
  const { logout } = useLoginValue();
  const router = useRouter();

  let queryIn = ''
  if (params === 'cre-complete') {
    queryIn = router.query.queryIn as string
  }
  if (params === 'pre-user' && router.query.accessToken) {
    const { creatorId, creatorName, accessToken } = router.query
    queryIn =`?creatorId=${creatorId}&creatorName=${creatorName}&accessToken=${accessToken}`
  }

  return (
    <div className={classes.rootMarketer}>
      {params === ('main' || 'twitch' || 'google' || 'kakao')
        ? <>
            <NavTop MainUserType logout={logout} />
            <RegistStepper platform={params} />
          </>
        : <div className={classes.rootCreator}>
            <NavTop logout={logout} />
            <div style={{ paddingTop: 90 }} />
            <SignupCreator pathname={params} queryIn={queryIn}/>
          </div> 
      }
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    {params: {regist: 'main'}},
    {params: {regist: 'twitch'}},
    {params: {regist: 'google'}},
    {params: {regist: 'kakao'}},
    {params: {regist: 'cre-signup'}},
    {params: {regist: 'cre-complete'}},
    {params: {regist: 'pre-user'}},
  ]
  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async (
  ctx: GetStaticPropsContext
) => {
  switch (ctx.params?.regist) {
    case 'twitch' :
      return {props: {params: 'twitch'}}
    case 'google' :
      return {props: {params: 'google'}}
    case 'kakao' :
      return {props: {params: 'kakao'}}
    case 'cre-signup' :
      return {props: {params: 'cre-signup'}}
    case 'cre-complete' :
      return {props: {params: 'cre-complete'}}
    case 'pre-user' : 
      return {props: {params: 'pre-user'}}
    default:
      return {props: {params: 'main'}}
  }
}