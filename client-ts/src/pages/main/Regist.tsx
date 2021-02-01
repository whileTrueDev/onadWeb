import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import RegistStepper from '../../organisms/main/regist/Stepper';
import AppAppBar from '../../organisms/main/layouts/AppAppbar';
import useLoginValue from '../../utils/hooks/useLoginValue';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh'
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
      <AppAppBar MainUserType="marketer" logout={logout} noTrigger />
      <RegistStepper platform={match.params.platform} />
    </div>
  );
}
