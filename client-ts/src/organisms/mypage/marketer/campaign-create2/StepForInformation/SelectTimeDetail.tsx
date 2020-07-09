import 'date-fns';
import React from 'react';
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import {
  TimeInterface,
  TimeAction,
} from '../campaignReducer';

interface SelectTimeDetailProps {
  state: TimeInterface;
  dispatch: React.Dispatch<TimeAction>;
}

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    border: '1px',
    padding: 'auto',
    width: '40px',
    textAlign: 'center'
  },
  td: {
    border: '1px',
    borderColor: theme.palette.common.black,
    borderStyle: 'solid',
    padding: 'auto',
    width: '45px',
    textAlign: 'center',
    height: '3px',
    backgroundColor: theme.palette.action.disabled,
  },
  tdCheck: {
    backgroundColor: theme.palette.primary.main,
  },
  font: { opacity: '0' }
}));

const SelectTimeDetail = (props: SelectTimeDetailProps): JSX.Element => {
  const classes = useStyles();
  const {
    state, dispatch
  } = props;
  const times = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  const onUpdate = (index: number) => () => {
    const newcheckState = state.timeList.map((item, j) => ((j === index) ? !item : item));
    dispatch({ key: 'settime', value: newcheckState });
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                    [classes.tdCheck]: state.timeList[index]
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
    </MuiPickersUtilsProvider>
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
