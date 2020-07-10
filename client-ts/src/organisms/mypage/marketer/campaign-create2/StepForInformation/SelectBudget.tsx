import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import StyledInput from '../../../../../atoms/StyledInput';
import GreenCheckbox from '../../../../../atoms/GreenCheckBox';
import StyledSelectText from '../../../../../atoms/StyledSelectText';

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%', fontSize: '12px', margin: 0,
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
  function handleToggle(): void {
    setToggle(!toggle);
  }

  return (
    <Grid container direction="column">
      <Grid container item direction="row">
        <GreenCheckbox
          name="no-limit"
          checked={!toggle}
          onClick={handleToggle}
        // disabled
        />
        <StyledSelectText
          onClick={handleToggle}
          style={{ cursor: 'pointer' }}
          primary="일예산제한 없이 계속 집행"
        />
      </Grid>
      <Grid container item direction="row">
        <GreenCheckbox
          name="set-limit"
          checked={toggle}
          onClick={handleToggle}
        />
        <StyledSelectText
          onClick={handleToggle}
          style={{ cursor: 'pointer' }}
          primary="일예산 설정"
          secondary="최소금액(5000원 이상)"
        />
      </Grid>
      {toggle && (
      <Grid container item>
        <Grid item>
          <StyledInput
            autoFocus
            name="campaign-create-budget"
            className={classes.input}
            type="number"
            inputRef={budgetInputRef}
            inputProps={{
              autoComplete: false,
              min: 5000,
              required: true
            }}
          />
        </Grid>
        <Grid item>
          원
        </Grid>
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
