import React from 'react';
import {
  Grid,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import BudgetInput from './BudgetInput';
import GreenCheckbox from '../../../atoms/GreenCheckBox';
import StyledSelectText from '../../../atoms/StyledSelectText';

const CampaignBudgetSet = (props) => {
  const {
    state, dispatch,
  } = props;

  const setBudget = () => {
    dispatch({ key: 'budget', value: null });
  };

  const setNoBudget = () => {
    dispatch({ key: 'noBudget' });
  };


  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="no-limit"
            checked={!state.budget}
            onClick={setNoBudget}
            // disabled
          />
          <StyledSelectText onClick={setNoBudget} style={{ cursor: 'pointer' }} primary="일예산제한 없이 계속 집행" />
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="set-limit"
            checked={state.budget}
            onClick={setBudget}
          />
          <StyledSelectText
            onClick={setBudget}
            style={{ cursor: 'pointer' }}
            primary="일예산 설정"
            secondary="최소금액(5000원 이상)"
          />
        </Grid>
        {state.budget && (
          <Grid item>
            <BudgetInput
              state={state}
              dispatch={dispatch}
            />
          </Grid>
        )}
      </Grid>
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
CampaignBudgetSet.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default CampaignBudgetSet;
