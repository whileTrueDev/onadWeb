import React from 'react';
import {
  Grid
} from '@material-ui/core';

import GreenCheckbox from '../../../../../atoms/GreenCheckBox';
import StyledSelectText from '../../../../../atoms/StyledSelectText';
import DatePicker from './DateTermPicker';

import {
  TermInterface,
  Action,
} from '../campaignReducer';

interface SelectDateTermProps {
  state: TermInterface;
  dispatch: React.Dispatch<Action>;
}

const SelectDateTerm = (props: SelectDateTermProps): JSX.Element => {
  const {
    state, dispatch
  } = props;

  const [toggle, setToggle] = React.useState(false);
  function handleToggle(): void {
    setToggle(!toggle);
  }

  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="no-limit"
            checked={toggle}
            onClick={handleToggle}
          />
          <StyledSelectText
            onClick={handleToggle}
            style={{ cursor: 'pointer' }}
            primary="승인일부터 종료일 없이 계속 집행"
          />
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <GreenCheckbox
            name="set-limit"
            checked={state.term}
            onClick={handleToggle}
          />
          <StyledSelectText
            primary="시작일 또는 종료일 설정"
            onClick={handleToggle}
            style={{ cursor: 'pointer' }}
          />
        </Grid>
      </Grid>
      {state.term && (
        <Grid item>
          <DatePicker state={state} dispatch={dispatch} />
        </Grid>
      )}
    </Grid>
  );
};

/**
 * @description
  해당 캠페인의 기간을 설정하거나 변경하는 컴포넌트

 * @param {*} state ? 기간을 저장하는 object
 * @param {*} dispatch ? 기간을 변경하는 func

 * @author 박찬우
 */

export default SelectDateTerm;
