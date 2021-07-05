import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    fontWeight: 600,
  },
  button: {
    fontWeight: 800,
    width: '100%',
    fontFamily: 'Noto Sans KR',
  },
  image: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    objectPosition: 'top',
    borderRadius: '50%',
  },
  contents: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    marginBottom: theme.spacing(4),
  },
  container: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

export default useStyles;
