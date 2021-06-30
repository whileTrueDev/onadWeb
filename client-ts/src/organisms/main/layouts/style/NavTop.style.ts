import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    width: '100%',
    height: 72,
    zIndex: 300,
    padding: theme.spacing('0px', '10%'),
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rootTriger: {
    backgroundColor: theme.palette.common.white,
    width: '100%',
    height: 72,
    zIndex: 300,
    padding: theme.spacing('0px', '10%'),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  blank: {
    [theme.breakpoints.up('xs')]: {
      width: 48,
      height: 48,
    },
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(0, 0),
  },
  logo: {
    marginTop: theme.spacing(0.5),
  },
  tabButtonWrap: {
    height: '100%',
    flex: 1,
    display: 'none',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  tabButton: {
    color: theme.palette.common.black,
    fontWeight: theme.typography.fontWeightRegular,
    margin: theme.spacing(0, 1),
    height: 40,
    fontSize: 18,
    borderRadius: 0,
    [theme.breakpoints.up('md')]: {
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: theme.spacing(3),
    },
  },
  creatorList: {
    color: theme.palette.common.black,
    height: 40,
    fontWeight: theme.typography.fontWeightRegular,
    margin: theme.spacing(0, 1),
    fontSize: 18,
    [theme.breakpoints.up('md')]: {
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: theme.spacing(3),
    },
  },
  coloredLink: {
    color: theme.palette.primary.main,
  },
  mobileButton: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: 18,
    borderRadius: 0,
    [theme.breakpoints.up('md')]: {
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.common.black,
    },
  },
  rightMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  buttonWraper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
}));

export default useStyles;
