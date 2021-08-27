import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import StyledInput from '../../../../../atoms/styledInput';
import GreenCheckbox from '../../../../../atoms/checkbox/greenCheckBox';
import StyledSelectText from '../../../../../atoms/styledSelectText';

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      fontSize: '12px',
      margin: 0,
    },
  },
}));

interface SelectBudgetProps {
  budgetInputRef: React.MutableRefObject<HTMLInputElement | undefined>;
}

const SelectBudget = (props: SelectBudgetProps): JSX.Element => {
  const classes = useStyles();
  const { budgetInputRef } = props;

  const [toggle, setToggle] = React.useState(false);
  function handleUse(): void {
    setToggle(true);
  }
  function handleNotUse(): void {
    setToggle(false);
  }

  return (
    <Grid container direction="column">
      <Grid container item direction="row" style={{ maxWidth: 400 }}>
        <GreenCheckbox
          name="no-limit"
          checked={!toggle}
          onClick={handleNotUse}
          // disabled
        />
        <StyledSelectText
          onClick={handleNotUse}
          style={{ cursor: 'pointer', maxWidth: 300 }}
          primary="일예산제한 없이 계속 집행"
        />
      </Grid>
      <Grid container item direction="row">
        <GreenCheckbox name="set-limit" checked={toggle} onClick={handleUse} />
        <StyledSelectText
          onClick={handleUse}
          style={{ cursor: 'pointer', maxWidth: 300 }}
          primary="일예산 설정"
          secondary={
            toggle && (
              <Typography variant="body2" color="textSecondary">
                최소금액
                <Typography color="error" variant="caption">
                  (5000원 이상)
                </Typography>
              </Typography>
            )
          }
        />
      </Grid>
      {toggle && (
        <Grid container item>
          <StyledInput
            autoFocus
            name="campaign-create-budget"
            className={classes.input}
            type="number"
            inputRef={budgetInputRef}
            inputProps={{
              min: 5000,
              step: 100,
              required: true,
            }}
          />
          <Grid item>원</Grid>
        </Grid>
      )}
    </Grid>
  );
};

/**
 * @description
  해당 캠페인의 budget을 설정하거나 변경하는 컴포넌트

 * @param {*} state ? budget을 저장하는 object
 * @param {*} dispatch ? budget을 변경하는 func

 * @author 박찬우
 */

export default SelectBudget;
