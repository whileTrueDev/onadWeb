import React from 'react';
import useStyles from './style/Regist.style';
import RegistStepper from '../../organisms/main/regist/Stepper';
import AppAppBar from '../../organisms/main/layouts/AppAppbar';
import useLoginValue from '../../utils/hooks/useLoginValue';
import withRoot from './withRoot';

interface Props {
  match: { params: { platform: string } };
}

export default withRoot(({ match }: Props) => {
  const classes = useStyles();
  const { logout } = useLoginValue();
  return (
    <div className={classes.root}>
      <AppAppBar MainUserType logout={logout} noTrigger />
      <RegistStepper platform={match.params.platform} />
    </div>
  );
});
