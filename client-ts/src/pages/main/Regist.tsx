import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import RegistStepper from '../../organisms/main/regist/Stepper';
import AppAppBar from '../../organisms/main/layouts/AppAppbar';
import useLoginValue from '../../utils/hooks/useLoginValue';
import withRoot from './withRoot';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

interface Props {
  match: { params: { platform: string } };
}

export default withRoot(({ match }: Props) => {
  const classes = useStyles();
  const { logout } = useLoginValue();
  return (
    <div className={classes.root}>
      <AppAppBar MainUserType="marketer" logout={logout} noTrigger />
      <RegistStepper platform={match.params.platform} />
    </div>
  );
});
