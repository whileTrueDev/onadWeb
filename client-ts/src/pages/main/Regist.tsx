import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import RegistStepper from '../../organisms/main/regist/Stepper';
import AppAppBar from '../../organisms/main/layouts/AppAppbar';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const Regist = (props) => {
  const classes = useStyles();
  const { match } = props;
  return (
    <div className={classes.root}>
      <AppAppBar MainUserType="marketer" noTrigger />
      <RegistStepper platform={match.params.platform} />
    </div>
  );
};


export default Regist;
