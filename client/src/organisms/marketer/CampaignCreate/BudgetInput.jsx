import React, { useEffect } from 'react';
import {
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Help from '@material-ui/icons/Help';
import NumberFormat from 'react-number-format';
import StyledInput from '../../../atoms/StyledInput';
import DangerTypography from '../../../atoms/Typography/Danger';

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

const BudgetInput = (props) => {
  const classes = useStyles();
  const {
    state, dispatch, budgetError, setBudgetError
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [budgetAnchorEl, setBudgetAnchorEl] = React.useState(null);

  // const [error, setError] = React.useState(false); // budget 작성시 한도 체크용 State
  // const [total, setTotal] = React.useState();
  // const [exepectedDay, setExcpectedDay] = React.useState(0);
  // const [exepectedViews, setExcpectedViews] = React.useState(0);

  // useEffect(() => {
  //   // type 1 - 예산 미설정
  //   if (state.option === 0 && state.noBudget) {
  //     handleSubmitCheck(true);
  //   } else if (state.option === 0 && !error && state.budget.length !== 0) {
  //     handleSubmitCheck(true);
  //   } else if (state.option === 1) {
  //     handleSubmitCheck(true);
  //   } else if (state.option === 2) {
  //     handleSubmitCheck(true);
  //   } else {
  //     handleSubmitCheck(false);
  //   }
  // }, [error, handleSubmitCheck, state.option, state.noBudget, state.budget.length]);

  // option을 선택하였을 때 event listener
  // const handleChange = (event) => {
  //   // event.preventDefault();
  //   dispatch({ key: event.target.name });
  // };

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
      setBudgetError(true);
    } else {
      // setExcpectedDay(parseInt(Number(value.value) / Number(total / 30), 10));
      // setExcpectedViews(parseInt(Number(value.value) / 2, 10));
      setBudgetError(false);
    }
  };

  return (
    <Grid container direction="row" spacing={2} className={classes.root}>
      <Grid item>
        <Grid container direction="column" spacing={2}>
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
                </Grid>
              </Grid>
              <Grid item>
                <DangerTypography>
                  {budgetError
                    && ('최소 금액보다 작습니다.')
                  }
                </DangerTypography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BudgetInput;
