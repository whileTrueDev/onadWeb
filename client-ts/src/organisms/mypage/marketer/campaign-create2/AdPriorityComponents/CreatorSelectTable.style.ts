import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  name: {
    fontWeight: 700, fontSize: '12px',
  },
  image: {
    width: 48,
    height: 48,
    marginRight: theme.spacing(3),
    backgroundColor: theme.palette.grey[300],
    [theme.breakpoints.only('lg')]: {
      width: 48,
      height: 48
    }
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  unit: { fontWeight: 700, marginLeft: '2px' },
  table: { boxShadow: 'none', overflow: 'hidden' },
  left: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left'
  },
}));
