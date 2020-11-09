
import { Theme, makeStyles } from '@material-ui/core/styles';

const useNotificationCardStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    maxWidth: 800
  },
  body: {
    marginRight: '4px',
    fontSize: '0.9rem',
  },
  head: {
    marginRight: '4px',
    fontSize: '1.05rem',
    fontWeight: 700
  },
  middle: {
    marginRight: '4px',
    fontSize: '0.8rem',
    fontWeight: 700
  },
  tail: {
    marginRight: '4px',
    fontSize: '0.9rem',
    fontWeight: 700
  },
  text: {
    alignItems: 'center'
  },
  warning: {
    marginRight: '4px',
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'red',
  }
}));

export default useNotificationCardStyles;
