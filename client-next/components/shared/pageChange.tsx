import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    zIndex: 9999,
    width: 144,
    height: 144,
    background: "no-repeat center url('/favicons/android-icon-144x144.png')",
    backgroundSize: 'cover',
  },
}));

export default function PageChange(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.logo} />
    </div>
  );
}
