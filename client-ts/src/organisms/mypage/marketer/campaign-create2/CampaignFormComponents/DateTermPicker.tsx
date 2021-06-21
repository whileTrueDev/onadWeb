import 'date-fns';
import koLocale from 'date-fns/locale/ko';
import React, { useState } from 'react';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

import { CampaignCreateAction, CampaignCreateInterface } from '../reducers/campaignCreate.reducer';

interface DateTermPickerProps {
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>;
}

function DateTermPicker(props: DateTermPickerProps): JSX.Element {
  // The first commit of Material-UI
  const { state, dispatch } = props;

  const [today] = useState(new Date());
  const handleStartDateChange = (date: any): void => {
    dispatch({ value: date, type: 'SET_TERM_START_DATE' });
  };

  const handleFinDateChange = (date: any): void => {
    dispatch({ value: date, type: 'SET_TERM_FIN_DATE' });
  };

  const [finDateToggle, setFinDatetoggle] = React.useState(true);
  const handleEndToggle = (): void => {
    if (finDateToggle === true) {
      dispatch({ type: 'RESET_TERM_FIN_DATE', value: '' });
    }
    setFinDatetoggle(!finDateToggle);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
      <Grid container>
        <KeyboardDatePicker
          autoOk
          disablePast
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          invalidDateMessage="날짜 형식이 올바르지 않습니다."
          id="start-date-picker"
          label="시작일"
          maxDateMessage="종료일보다 이전이여야 합니다."
          minDate={today}
          value={state.campaignTerm.startDate}
          onChange={handleStartDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          autoOk
          disablePast
          disabled={finDateToggle}
          format="yyyy/MM/dd"
          variant="inline"
          margin="normal"
          invalidDateMessage="날짜 형식이 올바르지 않습니다."
          minDateMessage="시작일보다 이후여야 합니다."
          id="end-date-picker"
          label="종료일"
          minDate={finDateToggle ? undefined : state.campaignTerm.startDate}
          value={state.campaignTerm.finDate}
          onChange={handleFinDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={finDateToggle}
              onChange={handleEndToggle}
              size="small"
              style={{ padding: '3px' }}
            />
          }
          label="종료일 미설정"
          labelPlacement="start"
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

/**
 * @description
  해당 캠페인의 기간을 선택하는 컴포넌트

 * @param {*} state ? 기간을 저장하는 object
 * @param {*} dispatch ? 기간을 변경하는 func

 * @author 박찬우
 */
export default DateTermPicker;
