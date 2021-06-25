import React from 'react';
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  table: { maxWidth: 960, borderCollapse: 'collapse' },
  legend: {
    display: 'flex',
    marginTop: theme.spacing(2),
    justifyContent: 'center',
    maxWidth: 960,
  },
  legendItem: {
    height: 20,
    width: 60,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  legendItemOn: { backgroundColor: theme.palette.primary.main },
  legendItemOff: { backgroundColor: theme.palette.action.disabled },
  thead: {
    border: '1px',
    padding: 'auto',
    width: '40px',
    textAlign: 'center',
  },
  td: {
    border: '1px',
    borderColor: theme.palette.common.black,
    borderStyle: 'solid',
    padding: 'auto',
    textAlign: 'center',
    height: '3px',
    backgroundColor: theme.palette.action.disabled,
  },
  tdCheck: {
    backgroundColor: theme.palette.primary.main,
  },
  font: { opacity: '0' },
}));

interface SelectTimeDetailProps {
  timeList: number[];
  onTimeSelect?: (timeIndex: number) => void;
}

export default function TimeSelector(props: SelectTimeDetailProps): JSX.Element {
  const { timeList, onTimeSelect } = props;
  const classes = useStyles();

  const times = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  ];

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
            {times.map(index => (
              <td className={classes.thead} key={index}>{`${index}`}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className={classes.td}>
            {times.map((index: number) => (
              <td
                className={classnames({
                  [classes.td]: true,
                  [classes.tdCheck]: timeList.indexOf(index) > -1,
                })}
                key={index}
                onClick={(): void => (onTimeSelect ? onTimeSelect(index) : undefined)}
                role="gridcell"
                style={{ cursor: onTimeSelect ? 'pointer' : 'default' }}
              >
                <span className={classes.font}>{index}</span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Grid>
  );
}
