import React from 'react';
import {
  Grid, Paper, Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Help from '@material-ui/icons/Help';
import StyledItemText from '../../../atoms/StyledItemText';
import StyledSelectText from '../../../atoms/StyledSelectText';
import GreenCheckbox from '../../../atoms/GreenCheckBox';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
    '& .MuiGrid-container': {
      flexWrap: 'nowrap',
    }
  },
  item: {
    marginBottom: '15px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      padding: 0,
    },
  },
  choice: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  ready: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
    color: 'rgba(0, 0, 0, 0.26)',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popover: {
    pointerEvents: 'none',
  },
  controlLabel: {
    label: {
      marginLeft: '10px',
    }
  },
  error: {
    fontWeight: '700',
    fontSize: '12px'
  },
  selected: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
    backgroundColor: '#B3FAC8'
  }
}));

const OptionPaper = (props) => {
  const classes = useStyles();
  const {
    state, dispatch, setStepComplete, step, setPriorityOpen,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  // const [total, setTotal] = React.useState();
  // const [exepectedDay, setExcpectedDay] = React.useState(0);
  // const [exepectedViews, setExcpectedViews] = React.useState(0);

  const open = Boolean(anchorEl);

  // option을 선택하였을 때 event listener
  const handleChange = (event) => {
    if (event.target.checked) {
      dispatch({ key: event.target.name });
      setStepComplete(true);
    } else {
      dispatch({ key: 'reset' });
      setStepComplete(false);
      setPriorityOpen(false);
    }
  };

  const handlePopoverOpen = index => (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const checkedOptionRender = (_option) => {
    switch (_option) {
      case 'option0':
        return (
          <Paper className={classes.selected}>
            <StyledSelectText primary="1. 배너 광고" secondary="상품, 브랜드 홍보만 하고 싶어요." />
            선택됨
          </Paper>
        );
      case 'option1':
        return (
          <Paper className={classes.selected}>
            <StyledSelectText primary="3. 배너 광고 + 클릭광고" secondary="상품, 브랜드 홍보만 하고 싶어요." />
            선택됨
          </Paper>
        );
      case 'option2':
        return (
          <Paper className={classes.selected}>
            <StyledSelectText primary="2. 클릭 광고" secondary="상품, 브랜드 홍보만 하고 싶어요." />
            선택됨
          </Paper>
        );
      default:
        return (
          <div />
        );
    }
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Grid container direction="column" spacing={3}>
          <Grid item className={classes.item}>
            <StyledItemText primary="첫째, &nbsp;&nbsp; 광고 유형 선택" secondary="해당 광고 캠페인의 유형을 선택하세요." />
            <Divider component="hr" style={{ height: '2px' }} />
          </Grid>
          {step !== 0 ? (
            <Grid item className={classes.item}>
              {checkedOptionRender(state.option)}
            </Grid>
          ) : (
            <Grid item className={classes.item}>
              <Grid container direction="row" justify="center" spacing={2}>
                <Grid item>
                  {/* <Paper className={classes.ready}> */}
                  <Paper className={classes.choice}>
                    <Grid container direction="column" justify="space-between">
                      <Grid item>
                        <StyledSelectText primary="1. 배너 광고" secondary="상품, 브랜드 홍보만 하고 싶어요." />
                      </Grid>
                      <Grid item className={classes.icon}>
                        <Grid container direction="row">
                          <Grid item className={classes.icon}>
                            <Help
                              fontSize="large"
                              color="disabled"
                              onMouseEnter={handlePopoverOpen(0)}
                              onMouseLeave={handlePopoverClose}
                              aria-owns={open ? 'send-desc-popover' : undefined}
                              aria-haspopup="true"
                            />
                          </Grid>
                          <Grid item>
                            <GreenCheckbox
                              name="option0"
                              checked={state.option === 'option0'}
                              onChange={handleChange}
                              fontSize="large"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper className={classes.choice}>
                    <Grid container direction="column" justify="space-between">
                      <Grid item>
                        <StyledSelectText primary="2. 클릭광고" secondary="구매 전환을 하고 싶어요." />
                      </Grid>
                      <Grid item className={classes.icon}>
                        <Grid container direction="row">
                          <Grid item className={classes.icon}>
                            <Help
                              fontSize="large"
                              color="disabled"
                              onMouseEnter={handlePopoverOpen(2)}
                              onMouseLeave={handlePopoverClose}
                              aria-owns={open ? 'send-desc-popover' : undefined}
                              aria-haspopup="true"
                            />
                          </Grid>
                          <Grid item>
                            <GreenCheckbox
                              name="option2"
                              checked={state.option === 'option2'}
                              onChange={handleChange}
                              fontSize="large"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper className={classes.choice}>
                    <Grid container direction="column" justify="space-between">
                      <Grid item>
                        <StyledSelectText primary="2. 배너 광고 + 클릭 광고" secondary="상품, 브랜드 홍보 뿐 아니라 구매 전환까지 하고 싶어요." />
                      </Grid>
                      <Grid item className={classes.icon}>
                        <Grid container direction="row">
                          <Grid item className={classes.icon}>
                            <Help
                              fontSize="large"
                              color="disabled"
                              onMouseEnter={handlePopoverOpen(1)}
                              onMouseLeave={handlePopoverClose}
                              aria-owns={open ? 'send-desc-popover' : undefined}
                              aria-haspopup="true"
                            />
                          </Grid>
                          <Grid item>
                            <GreenCheckbox
                              name="option1"
                              checked={state.option === 'option1'}
                              onChange={handleChange}
                              fontSize="large"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OptionPaper;
