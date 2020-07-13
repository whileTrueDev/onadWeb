import React from 'react';
import {
  Grid
} from '@material-ui/core';
import SelectTimeDetail from './SelectTimeDetail';
import GreenCheckbox from '../../../../../atoms/GreenCheckBox';
import StyledSelectText from '../../../../../atoms/StyledSelectText';

import {
  StepForInformationAction,
  StepForInformationInterface
} from '../reducers/campaignCreate.reducer';

interface SelectTimeProps {
  state: StepForInformationInterface;
  dispatch: React.Dispatch<StepForInformationAction>;
}

const SelectTime = (props: SelectTimeProps): JSX.Element => {
  const { state, dispatch } = props;

  const [toggle, setToggle] = React.useState(false);
  function handleUse(): void {
    setToggle(true);
  }
  function handleNotUse(): void {
    setToggle(false);
    dispatch({ type: 'RESET_TIME', value: '' });
  }

  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="no-limit"
            checked={!toggle}
            onClick={handleNotUse}
          />
          <StyledSelectText
            onClick={handleNotUse}
            style={{ cursor: 'pointer', maxWidth: 300 }}
            primary="시간대 설정 없이 계속 집행"
          />
        </Grid>
      </Grid>
      <Grid item>

        <Grid container direction="row">
          <GreenCheckbox
            name="set-limit"
            checked={toggle}
            onClick={handleUse}
          />
          <StyledSelectText
            primary="송출 시간대 설정"
            onClick={handleUse}
            style={{ cursor: 'pointer', maxWidth: 300 }}
          />
        </Grid>
        {toggle ? (<SelectTimeDetail state={state} dispatch={dispatch} />) : null}
      </Grid>
    </Grid>
  );
};

/**
 * @description
  해당 캠페인의 시간대를 설정하거나 변경하는 컴포넌트

 * @param {*} state ? 시간대를 저장하는 object
 * @param {*} dispatch ? 시간대를 변경하는 func

 * @author 박찬우
 */
export default SelectTime;
