import React, { useEffect } from 'react';
import {
  Grid, Paper, Divider, Collapse, Checkbox, FormControlLabel
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Help from '@material-ui/icons/Help';
import NumberFormat from 'react-number-format';
import DescPopover from '../../../atoms/DescPopover';
import StyledItemText from '../../../atoms/StyledItemText';
import StyledSelectText from '../../../atoms/StyledSelectText';
import GreenCheckbox from '../../../atoms/GreenCheckBox';
import StyledInput from '../../../atoms/StyledInput';
import DangerTypography from '../../../atoms/Typography/Danger';
import axios from '../../../utils/axios';
import HOST from '../../../utils/config';


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
  }
}));

const OptionPaper = (props) => {
  const classes = useStyles();
  const {
    handleSubmitCheck, state, dispatch, selectedCategory
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [budgetAnchorEl, setBudgetAnchorEl] = React.useState(null);
  const [descIndex, setDescIndex] = React.useState(0); // popover의 내용 Index

  const [budgetOpen, setBudgetOpen] = React.useState(false); // budget 입력창 띄우는 State
  const [error, setError] = React.useState(false); // budget 작성시 한도 체크용 State
  // const [total, setTotal] = React.useState();
  // const [exepectedDay, setExcpectedDay] = React.useState(0);
  // const [exepectedViews, setExcpectedViews] = React.useState(0);

  const open = Boolean(anchorEl);


  const handleNoBudgetChange = () => {
    dispatch({ key: 'noBudget' });
  };

  useEffect(() => {
    // type 1 - 예산 미설정
    if (state.option === 0 && state.noBudget) {
      handleSubmitCheck(true);
    } else if (state.option === 0 && !error && state.budget.length !== 0) {
      handleSubmitCheck(true);
    } else if (state.option === 1) {
      handleSubmitCheck(true);
    } else if (state.option === 2) {
      handleSubmitCheck(true);
    } else {
      handleSubmitCheck(false);
    }
  }, [error, handleSubmitCheck, state.option, state.noBudget, state.budget.length]);

  // option을 선택하였을 때 event listener
  const handleChange = (event) => {
    // event.preventDefault();
    if (event.target.checked) {
      dispatch({ key: event.target.name });
      if (event.target.name === 'option0') {
        // axios.post(`${HOST}/api/dashboard/marketer/campaign/getcategory`, selectedCategory)
        //   .then((res) => {
        //     if (res) {
        //       setTotal(res.data.result);
        //     }
        //   }).catch((errorData) => { alert('오류가 발생하였습니다. 나중에 다시 시도해주세요.'); });
        setBudgetOpen(true);
      } else {
        setBudgetOpen(false);
      }
    } else {
      dispatch({ key: 'reset' });
      setBudgetOpen(false);
      setError(false);
    }
  };

  const handlePopoverOpen = index => (event) => {
    setDescIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handleBudgetPopoverOpen = (event) => {
    setBudgetAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setBudgetAnchorEl(null);
  };

  // budget을 입력하였을 때 event listener
  const onChange = (value) => {
    dispatch({ key: 'budget', value: value.value });
    if (Number(value.value) < 5000 && value.value !== '') {
      setError(true);
    } else {
      // setExcpectedDay(parseInt(Number(value.value) / Number(total / 30), 10));
      // setExcpectedViews(parseInt(Number(value.value) / 2, 10));
      setError(false);
    }
  };


  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Grid container direction="column" spacing={3}>
          <Grid item className={classes.item}>
            <StyledItemText primary="다섯째, &nbsp;&nbsp; 광고 유형 선택" secondary="해당 광고 캠페인의 유형을 선택하세요." />
            <Divider component="hr" style={{ height: '2px' }} />
          </Grid>
          <Grid item className={classes.item}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                {/* <Paper className={classes.ready}> */}
                <Paper className={classes.choice}>
                  <Grid container direction="row" justify="space-between">
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
                            checked={state.option === 0}
                            onChange={handleChange}
                            fontSize="large"
                            // disabled
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.choice}>
                  <Grid container direction="row" justify="space-between">
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
                            checked={state.option === 2}
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
                  <Grid container direction="row" justify="space-between">
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
                            checked={state.option === 1}
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
        </Grid>
      </Grid>
      <Grid item>
        <Collapse in={budgetOpen}>
          <Grid container direction="column" spacing={2}>
            <Grid item className={classes.item}>
              <StyledItemText primary="여섯째, &nbsp;&nbsp; 일일 예산 설정" secondary="해당 광고 캠페인의 일일 최대 예산을 설정하세요." />
              <Divider component="hr" style={{ height: '2px', width: '50%' }} />
            </Grid>
            <Grid item className={classes.item}>
              <Grid container direction="column">
                <Grid item>
                  <Grid container spacing={1}>
                    <Grid item>
                      <NumberFormat
                        value={state.budget}
                        onValueChange={onChange}
                        customInput={StyledInput}
                        id="formatted-numberformat-input"
                        margin="dense"
                        style={{ width: '150px' }}
                        disabled={state.noBudget}
                        thousandSeparator
                        prefix="₩ "
                        allowNegative={false}
                      />
                    </Grid>
                    <Grid item className={classes.icon}>
                      원
                      <Help
                        fontSize="small"
                        color="disabled"
                        onMouseEnter={handleBudgetPopoverOpen}
                        onMouseLeave={handlePopoverClose}
                        aria-owns={budgetAnchorEl ? 'send-desc-popover' : undefined}
                        aria-haspopup="true"
                      />
                    </Grid>
                    <Grid item className={classes.icon}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            color="primary"
                            checked={state.noBudget}
                            onChange={handleNoBudgetChange}
                            fontSize="small"
                            style={{ padding: '3px' }}
                          />
                    )}
                        label="미설정"
                        labelPlacement="start"
                        // className={classes.controlLabel}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {/* <Grid item>
                  <Grid>
                    <StyledItemText
                      primary="예상 노출 일"
                      secondary={`${exepectedDay} 일`}
                    />
                  </Grid>
                </Grid> */}
                {/* <Grid item>
                  <Grid>
                    <StyledItemText
                      primary="예상 노출 수"
                      secondary={`${exepectedViews} 회`}
                    />
                  </Grid>
                </Grid> */}
                <Grid item>
                  <DangerTypography>
                    {error
                      && ('최소 금액보다 작습니다.')
                    }
                  </DangerTypography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Collapse>
      </Grid>
      <DescPopover open={open} anchorEl={anchorEl} handlePopoverClose={handlePopoverClose} descIndex={descIndex} contentType="option" />
      <DescPopover
        open={Boolean(budgetAnchorEl)}
        anchorEl={budgetAnchorEl}
        handlePopoverClose={handlePopoverClose}
        descIndex={0}
        contentType="budget"
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      />
    </Grid>
  );
};

export default OptionPaper;
