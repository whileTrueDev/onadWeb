import { CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  center: { position: 'absolute', top: 'calc(50%)', left: 'calc(50%)' },
}));

export default function DashboardLoading(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.center}>
      <CircularProgress />
    </div>
  );
}
