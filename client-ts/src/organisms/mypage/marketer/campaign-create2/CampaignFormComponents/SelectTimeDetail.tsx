import React from 'react';
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';

import {
  CampaignCreateAction,
  CampaignCreateInterface
} from '../reducers/campaignCreate.reducer';
import SelectTimeDetailUseStyles from './SelectTimeDetail.style';

interface SelectTimeDetailProps {
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>;
}

const SelectTimeDetail = (props: SelectTimeDetailProps): JSX.Element => {
  const { state, dispatch } = props;
  const classes = SelectTimeDetailUseStyles();

  const times = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  const onUpdate = (index: number) => (): void => {
    dispatch({ type: 'SET_TIME', value: String(index) });
  };

  return (
    <Grid container item direction="column">
      {/* 송출 / 송출 안함에 대한 범례 */}
      <Grid item className={classes.legend}>
        <div className={classnames([classes.legendItem, classes.legendItemOn])} />
        <span>송출</span>
        <div className={classnames([classes.legendItem, classes.legendItemOff])} />
        <span>송출안함</span>
      </Grid>

      {/* 송출 시간 선택 */}
      <table className={classes.table}>
        <thead>
          <tr>
            {times.map((index) => (
              <td className={classes.thead} key={index}>{`${index}시`}</td>))}
          </tr>
        </thead>
        <tbody>
          <tr className={classes.td}>
            {times.map((index: number) => (
              <td
                className={classnames({
                  [classes.td]: true,
                  [classes.tdCheck]: state.campaignTime.indexOf(String(index)) > -1
                })}
                key={index}
                onClick={onUpdate(index)}
                role="gridcell"
                style={{ cursor: 'pointer' }}
              >
                <span className={classes.font}>
                  {index}
                </span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Grid>
  );
};

/**
 * @description
  해당 캠페인의 시간대를 변경하는 컴포넌트

 * @param {*} state ? 시간대를 저장하는 object
 * @param {*} dispatch ? 시간대를 변경하는 func

 * @author 박찬우
 */

export default SelectTimeDetail;
