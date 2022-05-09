import { Box, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import NavTop from '../../organisms/main/layouts/NavTop';
import useLoginValue from '../../utils/hooks/useLoginValue';

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
      {/* <RegistStepper platform={match.params.platform} /> */}
    </div>
  );
}
