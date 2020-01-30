import React from 'react';
import {
  Grid, Paper, Divider, Collapse
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Help from '@material-ui/icons/Help';
import DescPopover from '../../../atoms/DescPopover';
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

}));

const PriorityPaper = (props) => {
  const {
    handleNext, state, dispatch, setStepComplete, creatorList, checkedCreators, checkedPriorityRender
    checkedCreatorsDispatch, handleBack, stepComplete, categoryList, checkedCategories, checkedCategoriesDispatch, priorityOpen, createPaperOpen
  } = props;
  const classes = useStyles();
  // const [state, dispatch] = useReducer(myReducer, { choose: 0, type: 0 });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [descIndex, setDescIndex] = React.useState(0);
  const open = Boolean(anchorEl);

  const handleChange = (event) => {
    if (event.target.checked) {
      dispatch({ type: event.target.name });
      setStepComplete(true);
      console.log(event.target.name);
    } else {
      console.log('체크 해제', event.target.name);
      dispatch({ type: 'reset' });
      setStepComplete(false);
    }
  };

  const handlePopoverOpen = index => (event) => {
    setDescIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };


  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Grid container direction="column" spacing={3}>
          <Grid item className={classes.item}>
            <StyledItemText primary="셋째,&nbsp;&nbsp; 광고 송출방식 선택" secondary="해당 캠페인의 송출방식을 선택하세요." />
            <Divider component="hr" style={{ height: '2px' }} />
          </Grid>
          {createPaperOpen ? (
            <Grid item className={classes.item}>
              {checkedPriorityRender(state.priorityType)}
            </Grid>
          ) : (
            <Grid item className={classes.item}>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Paper className={classes.choice}>
                    <Grid container direction="row" justify="space-between">
                      <Grid item>
                        <StyledSelectText primary="1. 크리에이터 우선형" secondary="원하는 크리에이터에게 광고를 넣을 수 있어요." />
                        {/* 광고를 넣고 싶은 크리에이터가 있어요. */}
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
                              name="type0"
                              checked={state.priorityType === 'type0'}
                              onChange={handleChange}
                              fontSize="large"
                              // disabled
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Collapse in={state.priorityType === 'type0'}>
                      <CreatorSelect
                        setStepComplete={setStepComplete}
                        creatorList={creatorList}
                        checkedCreators={checkedCreators}
                        checkedCreatorsDispatch={checkedCreatorsDispatch}
                        handleBack={handleBack}
                        handleNext={handleNext}
                        stepComplete={stepComplete}
                      />
                    </Collapse>
                  </Paper>
                </Grid>

                <Grid item>
                  <Paper className={classes.choice}>
                    <Grid container direction="row" justify="space-between">
                      <Grid item>
                        <StyledSelectText primary="2. 카테고리 우선형" secondary="제품에 맞는 카테고리에 광고를 넣고 싶어요." />
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
                              name="type2"
                            />
                          </Grid>
                          <Grid item>
                            <GreenCheckbox
                              name="type1"
                              checked={state.priorityType === 'type1'}
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
              <Grid item>
                <Paper className={classes.choice}>
                  <Grid container direction="row" justify="space-between">
                    <Grid item>
                      <StyledSelectText primary="3. 노출 우선형" secondary="단기간에 노출을 많이 하고 싶어요." />
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
                            name="type3"
                          />
                        </Grid>
                        <Grid item>
                          <GreenCheckbox
                            name="type2"
                            checked={state.type === 2}
                            onChange={handleChange}
                            onClick={handleNext(false, 4)}
                            fontSize="large"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <DescPopover open={open} anchorEl={anchorEl} handlePopoverClose={handlePopoverClose} descIndex={descIndex} contentType="priority" />

    </Grid>
  );
};

export default PriorityPaper;
