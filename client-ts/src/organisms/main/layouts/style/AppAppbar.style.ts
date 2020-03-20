import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'rgb( 255, 255, 255, 0)',
    position: 'fixed',
    width: '100%',
    height: 64,
    zIndex: 100,
  },
  root2: {
    backgroundColor: 'white',
    position: 'fixed',
    width: '100%',
    height: 64,
    zIndex: 100,
    boxShadow: '0 1px 10px gainsboro'
  },
  left: {
    [theme.breakpoints.up('sm')]: {
      width: 48,
      height: 48
    },
    [theme.breakpoints.up('xs')]: {
      width: 48,
      height: 48
    },
  },
  title: {
    fontSize: 24,
  },
  toolbar: {
    justifyContent: 'space-between',
    padding: '0px 0px'
  },
  rightDesktop: {
    height: '100%',
    flex: 1,
    display: 'none',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  rightDesktop2: {
    height: '100%',
    flex: 1,
    display: 'none',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  rightMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  rightLink: {
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: 0,
    marginRight: 20,
    fontSize: 20,
    borderRadius: 0,
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.up('md')]: {
      fontWeight: 'bold',
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
    },
  },
  rightLink2: {
    color: theme.palette.common.black,
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: 0,
    marginRight: 20,
    fontSize: 20,
    borderRadius: 0,
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.up('md')]: {
      fontWeight: 'bold',
      color: theme.palette.common.black,
      marginLeft: theme.spacing(3),
    },
  },
  rightLink3: {
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: 0,
    marginRight: 20,
    fontSize: 20,
    height: 50,
    borderRadius: 5,
    border: '1px solid white',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.up('md')]: {
      fontWeight: 'bold',
      color: theme.palette.common.white,
      marginLeft: theme.spacing(3),
    },
  },
  rightLink4: {
    color: theme.palette.common.black,
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: 0,
    marginRight: 20,
    fontSize: 20,
    height: 50,
    borderRadius: 5,
    border: '1px solid black',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.up('md')]: {
      fontWeight: 'bold',
      color: theme.palette.common.black,
      marginLeft: theme.spacing(3),
    },
  },
  coloredLink: {
    color: theme.palette.primary.main,
  },
  buttonIcon: {
    marginRight: 10,
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer',
    },
    '&>img': {
      width: 160,
      height: 45
    }
  },
  noButtonIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer',
    },
    '&>img': {
      width: 124,
      height: 25
    }
  }
}));

export default useStyles;
