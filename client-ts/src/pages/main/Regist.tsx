import React from 'react';
import useStyles from './style/Regist.style';
import RegistStepper from '../../organisms/main/regist/Stepper';
import AppAppBar from '../../organisms/main/layouts/AppAppbar';
import useLoginValue from '../../utils/hooks/useLoginValue';

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
