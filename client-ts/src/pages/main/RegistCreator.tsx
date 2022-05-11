import { Box, makeStyles, Typography } from '@material-ui/core';
import NavTop from '../../organisms/main/layouts/NavTop';
import SignupCreator from '../../organisms/main/signup-creator/SignupCreator';
import { useLoginValue } from '../../utils/hooks';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));
export default function RegistCreator(): JSX.Element {
  const classes = useStyles();
  const { logout } = useLoginValue();

  return (
    <div className={classes.root}>
      {/* mainUserType true:광고주, false:크리에이터 */}
      <NavTop MainUserType={false} logout={logout} />

      <div style={{ paddingTop: 90 }} />

      <SignupCreator />
    </div>
  );
}

export function RegistCreatorServiceDone(): JSX.Element {
  const classes = useStyles();
  const { logout } = useLoginValue();

  return (
    <div className={classes.root}>
      {/* mainUserType true:광고주, false:크리에이터 */}
      <NavTop MainUserType={false} logout={logout} />

      <div style={{ paddingTop: 90 }} />

      <Box
        minHeight={400}
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        flexDirection="column"
      >
        <Typography>온애드는 더이상 회원가입이 불가능합니다.</Typography>
        <Typography>이용해 주셔서 감사합니다.</Typography>
      </Box>

      {/* <SignupCreator /> */}
    </div>
  );
}
