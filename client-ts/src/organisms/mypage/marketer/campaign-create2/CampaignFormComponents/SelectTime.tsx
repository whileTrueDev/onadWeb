import React from 'react';
import {
  Grid, Typography
} from '@material-ui/core';
import GreenCheckbox from '../../../../../atoms/Checkbox/GreenCheckBox';
import StyledSelectText from '../../../../../atoms/StyledSelectText';

import {
  CampaignCreateAction,
  CampaignCreateInterface
} from '../reducers/campaignCreate.reducer';
import TimeSelector from '../../../../../atoms/Selector/TimeSelector';

interface SelectTimeProps {
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>;
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

  function handleTimeSelect(timeIndex: number): void {
    dispatch({ type: 'SET_TIME', value: String(timeIndex) });
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
            primary="시간 설정 없이 계속 집행"
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
            primary="송출 시간 설정"
            secondary={toggle && (
              <Typography variant="body2" color="textSecondary">
                선택한 시간대에 광고가 송출됩니다.
                <Typography color="error" variant="caption">(중복 선택 가능)</Typography>
              </Typography>
            )}
            onClick={handleUse}
            style={{ cursor: 'pointer', maxWidth: 300 }}
          />
        </Grid>
        {toggle
          ? (<TimeSelector timeList={state.campaignTime} onTimeSelect={handleTimeSelect} />)
          : null}
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
