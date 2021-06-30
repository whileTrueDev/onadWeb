import makeStyles from '@material-ui/core/styles/makeStyles';
import NavTop from '../../organisms/main/layouts/NavTop';
import RegistStepper from '../../organisms/main/regist/Stepper';

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
  return (
    <div className={classes.root}>
      <NavTop />
      <RegistStepper platform={match.params.platform} />
    </div>
  );
}
