import classnames from 'classnames';
import MuiCircularProgress, {
  CircularProgressProps as MuiCircularProgressProps,
} from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  big: {
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(15),
  },
}));

interface CircularProgressProps extends MuiCircularProgressProps {
  small?: boolean;
}

export default function CircularProgress({
  small = false,
  ...rest
}: CircularProgressProps): JSX.Element {
  const classes = useStyles();

  return (
    <div>
      {small ? (
        <div className={classes.wrapper}>
          <MuiCircularProgress {...rest} />
        </div>
      ) : (
        <div className={classnames([classes.wrapper, classes.big])}>
          <MuiCircularProgress {...rest} />
        </div>
      )}
    </div>
  );
}
