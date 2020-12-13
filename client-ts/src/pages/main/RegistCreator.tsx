import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import AppAppBar from '../../organisms/main/layouts/AppAppbar';
import { useLoginValue } from '../../utils/hooks';
import SignupCreator from '../../organisms/main/signup-creator/SignupCreator';
import SignupPreCreator from '../../organisms/main/signup-creator/SignupPreCreator';

const useStyles = makeStyles((theme) => ({
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
      <AppAppBar MainUserType="creator" logout={logout} noTrigger />

      <div style={{ paddingTop: 90 }} />

      <SignupCreator />
    </div>
  );
}
