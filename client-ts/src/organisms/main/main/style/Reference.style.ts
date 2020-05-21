import makeStyles from '@material-ui/core/styles/makeStyles';
import grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: grey[100],
    width: '100%',
    height: 'auto',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3% 10% 3% 10%'
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
