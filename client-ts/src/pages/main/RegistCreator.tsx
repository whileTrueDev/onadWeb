import { makeStyles } from '@material-ui/core';
import NavTop from '../../organisms/main/layouts/NavTop';
import SignupCreator from '../../organisms/main/signup-creator/SignupCreator';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));
export default function RegistCreator(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* mainUserType true:광고주, false:크리에이터 */}
      <NavTop />

      <div style={{ paddingTop: 90 }} />

      <SignupCreator />
    </div>
  );
}
