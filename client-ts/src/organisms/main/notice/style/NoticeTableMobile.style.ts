import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: 0,
    minWidth: 360,
    minHeight: '70vh',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default useStyles;
