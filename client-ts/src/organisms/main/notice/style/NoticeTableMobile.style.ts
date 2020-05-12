import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: 0,
    minWidth: 360,
    minHeight: '70vh',
    backgroundColor: theme.palette.background.paper,
    fontFamily: 'Noto Sans KR',
  },
  MustTopic: {
    backgroundColor: '#F5A9A9',
    color: '#000'
  },
  JustTopic: {
    backgroundColor: '#fff',
    color: '#000'
  }
}));

export default useStyles;
