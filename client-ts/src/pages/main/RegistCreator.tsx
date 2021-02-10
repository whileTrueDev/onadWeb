import React from 'react';
import { makeStyles } from '@material-ui/core';
import AppAppBar from '../../organisms/main/layouts/AppAppbar';
import { useLoginValue } from '../../utils/hooks';
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
  const { logout } = useLoginValue();

  return (
    <div className={classes.root}>
      {/* mainUserType true:광고주, false:크리에이터 */}
      <AppAppBar MainUserType={false} logout={logout} noTrigger />

      <div style={{ paddingTop: 90 }} />

      <SignupCreator />
    </div>
  );
}
