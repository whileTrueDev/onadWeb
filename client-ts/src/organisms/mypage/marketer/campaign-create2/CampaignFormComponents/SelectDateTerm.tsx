import React from 'react';
import { Grid } from '@material-ui/core';

import GreenCheckbox from '../../../../../atoms/Checkbox/GreenCheckBox';
import StyledSelectText from '../../../../../atoms/StyledSelectText';
import DatePicker from './DateTermPicker';

import { CampaignCreateAction, CampaignCreateInterface } from '../reducers/campaignCreate.reducer';

interface SelectDateTermProps {
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>;
}

const SelectDateTerm = (props: SelectDateTermProps): JSX.Element => {
  const { state, dispatch } = props;

  const [toggle, setToggle] = React.useState(false);
  function handleUse(): void {
    setToggle(true);
  }
  function handleNotUse(): void {
    setToggle(false);
    dispatch({ type: 'RESET_TERM_FIN_DATE', value: '' });
  }

  return (
    <Grid container direction="column">
      <Grid container item direction="row">
        <GreenCheckbox name="no-limit" checked={!toggle} onClick={handleNotUse} />
        <StyledSelectText
          onClick={handleNotUse}
          style={{ cursor: 'pointer' }}
          primary="승인일부터 종료일 없이 계속 집행"
        />
      </Grid>
      <Grid item container direction="row">
        <GreenCheckbox name="set-limit" checked={toggle} onClick={handleUse} />
        <StyledSelectText
          primary="시작일 또는 종료일 설정"
          onClick={handleUse}
          style={{ cursor: 'pointer' }}
        />
      </Grid>
      {toggle && (
        <Grid item container>
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
