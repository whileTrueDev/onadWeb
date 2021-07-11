// material-UI
import makeStyles from '@material-ui/core/styles/makeStyles';
// 내부 소스
// 프로젝트 내부 모듈
// 컴포넌트
import NavTop from '../components/layout/navTop';
import RegistStepper from '../components/regist/stepper';
// util 계열
import useLoginValue from '../utils/hooks/useLoginValue';
// 스타일

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
}));

interface Props {
  match: { params: { platform: string } };
}

export default function Regist({ match }: Props): JSX.Element {
  const classes = useStyles();
  const { logout } = useLoginValue();
  return (
    <div className={classes.root}>
      <NavTop MainUserType logout={logout} />
      <RegistStepper platform={match.params.platform} />
    </div>
  );
}
