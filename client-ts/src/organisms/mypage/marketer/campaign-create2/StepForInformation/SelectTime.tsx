import React from 'react';
import {
  Grid
} from '@material-ui/core';
import TimeSelector from './SelectTimeDetail';
import GreenCheckbox from '../../../../../atoms/GreenCheckBox';
import StyledSelectText from '../../../../../atoms/StyledSelectText';

import {
  TimeInterface,
  TimeAction,
} from '../campaignReducer';

interface SelectTimeProps {
  state: TimeInterface;
  dispatch: React.Dispatch<TimeAction>;
}

const SelectTime = (props: SelectTimeProps): JSX.Element => {
  const {
    state,
    dispatch
  } = props;

  const setTime = (): void => {
    dispatch({ key: 'time', value: [] });
  };

  const setNoTime = (): void => {
    dispatch({ key: 'noTime', value: [] });
  };


  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="no-limit"
            checked={!state.time}
            onClick={setNoTime}
          />
          <StyledSelectText
            onClick={setNoTime}
            style={{ cursor: 'pointer' }}
            primary="시간대 설정 없이 계속 집행"
          />
        </Grid>
      </Grid>
      <Grid item>

        <Grid container direction="row">
          <GreenCheckbox
            name="set-limit"
            checked={state.time}
            onClick={setTime}
          />
          <StyledSelectText
            primary="송출 시간대 설정"
            onClick={setTime}
            style={{ cursor: 'pointer' }}
          />
        </Grid>
        {state.time ? (
          <TimeSelector
            state={state}
            dispatch={dispatch}
          />
        ) : null}
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
