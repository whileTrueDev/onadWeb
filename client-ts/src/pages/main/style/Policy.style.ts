import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(8)
  },
  contentBox: {
    width: '80%',
    margin: '0px auto',
    wordBreak: 'keep-all'
  },
  policyTitle: {
    paddingTop: '10px',
  },
  button: {
    color: theme.palette.common.white,
    background: 'linear-gradient(to right, #3589fc, #0dd0ff)',
    borderRadius: 10,
    height: 50,
    width: 200,
    '&:hover': {
      background: 'linear-gradient(to right, #3589fc, #0dd0ff)',
    },
    margin: theme.spacing(0, 1.5)
  },
  buttonPrivacy: {
    color: theme.palette.common.black,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    height: 50,
    width: 200,
    border: '1px solid grey',
    '&:hover': {
      background: 'linear-gradient(to right, #3589fc, #0dd0ff)',
    },
    margin: theme.spacing(0, 1.5)
  }
}));

export default useStyles;
