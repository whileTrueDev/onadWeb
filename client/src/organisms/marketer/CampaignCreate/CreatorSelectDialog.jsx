import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Divider, Slide
} from '@material-ui/core';

import Dialog from '../../../atoms/Dialog/Dialog';
import StyledItemText from '../../../atoms/StyledItemText';
import CreatorTable from './sub/CreatoreTable';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
}));

const SLIDE_TIMEOUT = 500;

const Transition = React.forwardRef((props, ref) => (
  <Slide
    direction="up"
    ref={ref}
    {...props}
  />
));

const CreatorSelect = (props) => {
  const { setStepComplete } = props;
  const classes = useStyles();

  useEffect(() => {
    setStepComplete(true);
  });

  return (
    <Dialog
      fullScreen
      disableBackdropClick
      // title="캠페인 효과 분석"
      open
      // onClose={handleClose}
      TransitionComponent={Transition}
      TransitionProps={{
        timeout: { enter: SLIDE_TIMEOUT, exit: SLIDE_TIMEOUT }
      }}
    >
      <Grid container direction="column" spacing={2} className={classes.root}>
        <Grid item>
          <Grid container direction="column" spacing={2}>
            <Grid item className={classes.item}>
              <StyledItemText primary="넷째,&nbsp;&nbsp; 크리에이터 선택" secondary="해당 캠페인의 배너가 송출될 크리에이터를 선택하세요." className={classes.label} />
              <Divider component="hr" style={{ height: '2px' }} />
            </Grid>
            <Grid item>
              <CreatorTable />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>

  );
};

export default CreatorSelect;
