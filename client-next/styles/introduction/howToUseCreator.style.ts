import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    margin: theme.spacing(5, 0),
  },
  creatorUse: {
    padding: theme.spacing(3, 4),
    wordBreak: 'keep-all',
    borderTop: '1px solid #29e3dc',
    borderLeft: '1px solid #29e3dc',
    borderBottom: '1px solid #29e3dc',
    position: 'relative',
    [theme.breakpoints.between('sm', 'sm')]: {
      padding: theme.spacing(1.5, 2),
      borderLeft: 'none',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      borderLeft: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  lineDecoration: {
    width: 130,
    position: 'absolute',
    left: -1,
    top: -5,
    borderBottom: '5px solid #29e3dc',
  },
  subTitle: {
    fontFamily: 'Noto Sans kr',
    color: 'white',
    margin: theme.spacing(2, 0),
    [theme.breakpoints.down('sm')]: {
      fontSize: 35,
    },
  },
  useNumber: {
    color: '#29e3dc',
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('sm')]: {
      fontSize: 45,
    },
  },
  Content: {
    marginTop: theme.spacing(2),
    fontSize: 15,
  },
  sampleLink: {
    color: theme.palette.common.black,
    border: '1px solid black',
    borderRadius: 10,
    width: 100,
    fontSize: 16,
    marginTop: 20,
  },
  contentImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  semiTitle: {
    color: '#29e3dc',
    fontFamily: 'Noto Sans kr',
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default useStyles;
