import { makeStyles } from '@material-ui/core/styles';

const Styles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(4, 0),
  },
  title: {
    margin: theme.spacing(5, 0),
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('md')]: {
      fontSize: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '30px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '30px',
    },
    color: '#008bf0',
    fontFamily: 'Noto Sans KR',
  },
  title2: {
    margin: theme.spacing(5, 0),
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('md')]: {
      fontSize: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '30px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '30px',
    },
    color: '#00b7b0',
    fontFamily: 'Noto Sans KR',
  },
  titleWrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ansWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  ansTitle: {
    fontSize: 20,
  },
  arrow: {
    width: 25,
    height: 12,
  },
  color: {
    color: theme.palette.common.black,
  },
}));

export default Styles;
