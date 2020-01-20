import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AppAppBar from '../../organisms/main/layout/AppAppBar';
import RegistStepper from '../../organisms/main/Regist/Stepper';

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
      <AppAppBar unuse={false} />
      <RegistStepper platform={match.params.platform} />
    </div>
  );
};


export default Regist;
