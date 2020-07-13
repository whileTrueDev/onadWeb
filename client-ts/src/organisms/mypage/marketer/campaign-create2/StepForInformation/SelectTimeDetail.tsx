import React from 'react';
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';

import {
  StepForInformationAction,
  StepForInformationInterface
} from '../reducers/campaignCreate.reducer';
import SelectTimeDetailUseStyles from './SelectTimeDetail.style';

interface SelectTimeDetailProps {
  state: StepForInformationInterface;
  dispatch: React.Dispatch<StepForInformationAction>;
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
    <Grid container justify="space-around">
      <table className={classes.table}>
        <thead>
          <tr>
            {times.map((index) => (<td className={classes.thead} key={index}>{`${index}시`}</td>))}
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
