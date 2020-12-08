import { grey } from '@material-ui/core/colors';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: grey[100],
    height: 'auto',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
  image: {
    width: 200,
    height: 100,
  },
  ImageSelector: {
    '&>img:last-child': {
      display: 'none'
    },
    '&:hover>img:first-child': {
      display: 'none'
    },
    '&:hover>img:last-child': {
      display: 'inline-block'
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 600,
    fontFamily: 'Noto sans KR',
  },
}));

export default useStyles;
