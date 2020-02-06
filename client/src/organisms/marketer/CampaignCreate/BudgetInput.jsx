import React from 'react';
import {
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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

  // budget을 입력하였을 때 event listener
  const onChange = (value) => {
    dispatch({ key: 'budget', value: value.value });
    if (Number(value.value) < 5000 && value.value !== '') {
      console.log(value.value);
      setBudgetError(true);
      console.log('if 5000', budgetError);
    } else {
      // setExcpectedDay(parseInt(Number(value.value) / Number(total / 30), 10));
      // setExcpectedViews(parseInt(Number(value.value) / 2, 10));
      console.log('else', budgetError);
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
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <DangerTypography>
                  {budgetError && ('최소 금액보다 작습니다.')}
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
