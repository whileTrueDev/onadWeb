import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(() => ({
  contents: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    margin: 10,
  },
  contentText: {
    fontSize: 13,
  },
  textfield: {
    width: 500,
  },
}));

export default useStyles;
