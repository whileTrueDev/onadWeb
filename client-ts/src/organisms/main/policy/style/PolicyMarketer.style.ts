import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 70
  },
  content: {
    marginTop: 20,
    fontFamily: 'Noto Sans KR',
  },
  text: {
    marginTop: 30,
  },
  policyWrapper: {
    marginTop: theme.spacing(8)
  }
}));

export default useStyles;
