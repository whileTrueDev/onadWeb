import { grey } from '@material-ui/core/colors';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: grey[100],
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wrapper: {
    width: '60%',
    transformOrigin: '50% 50%',
    transform: 'rotate(-10deg)',
  },
  image: {
    width: 280,
    height: 140,
  },
  ImageSelector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default useStyles;
