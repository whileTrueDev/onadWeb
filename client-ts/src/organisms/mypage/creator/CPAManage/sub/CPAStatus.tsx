import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  status: {
    position: 'absolute',
    left: 0,
    padding: theme.spacing(1),
    borderRadius: '0px 0px 5px 0px',
    color: theme.palette.common.white,
  },
  primary: { backgroundColor: theme.palette.primary.light, },
  secondary: { backgroundColor: theme.palette.secondary.light, },
}));

enum CPAStatusEnum {
  RUNNING = 'primary',
  STOPPED = 'secondary'
}
interface CPAStatusProps {
  color: 'primary' | 'secondary';
}
export default function CPAStatus({
  color
}: CPAStatusProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classnames({
      [classes.status]: true,
      [classes.primary]: color === CPAStatusEnum.RUNNING,
      [classes.secondary]: color === CPAStatusEnum.STOPPED,
    })}
    >
      <Typography variant="body2" style={{ color: 'white' }}>
        {color === CPAStatusEnum.RUNNING && ('등록됨')}
        {color === CPAStatusEnum.STOPPED && ('제외됨')}
      </Typography>
    </div>
  );
}
