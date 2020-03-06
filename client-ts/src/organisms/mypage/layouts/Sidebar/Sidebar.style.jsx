import {
  drawerWidth,
} from '../../../../assets/jss/onad';

const sidebarStyle = (theme) => ({
  flex: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerPaper: {
    border: 'none',
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    zIndex: '1',
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'fixed',
      height: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '80px',
      position: 'fixed',
      display: 'block',
      top: '0',
      height: '100vh',
      right: '0',
      left: 'auto',
      zIndex: '1032',
      visibility: 'visible',
      overflowY: 'visible',
      borderTop: 'none',
      textAlign: 'left',
      paddingRight: '0px',
      paddingLeft: '0',
      transform: `translate3d(${80}px, 0, 0)`,
    },
  },
  desktopPaper: {
    overflow: false,
    border: 'none',
    top: '0',
    bottom: '0',
    left: '0',
    zIndex: '1',
    width: drawerWidth,
  },
  desktopLogo: {
    zIndex: '4',
  },
  mobileHead: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: '15px',
    padding: '0',
    margin: '0',
    zIndex: '4',
    marginBottom: '10px',
    backgroundColor: theme.palette.secondary.main
  },
  head: {
    width: '100%',
    marginTop: '15px',
    padding: '0',
    margin: '0',
    zIndex: '4',
    marginBottom: '30px',
    backgroundColor: theme.palette.secondary.main
  },
  desktopImg: {
    display: 'flex',
    width: '60%',
    height: '60px',
  },
  img: {
    width: '35px',
    verticalAlign: 'middle',
    border: '0',
  },
  background: {
    position: 'absolute',
    zIndex: '1',
    height: '100%',
    width: '100%',
    display: 'block',
    top: '0',
    left: '0',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    '&:after': {
      position: 'absolute',
      zIndex: '3',
      width: '100%',
      height: '100%',
      content: '""',
      display: 'block',
      background: '#fff',
    },
  },
  NavBarLinksWrapper: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    borderTop: `0.05em solid ${'#fff'}`,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  itemLink: {
    width: '100%',
    transition: 'all 300ms linear',
    borderRadius: '3px',
    position: 'relative',
    display: 'block',
    padding: '10px 8px',
    paddingTop: '15px',
    paddingBottom: '15px',
    [theme.breakpoints.down('md')]: {
      padding: 0,
      margin: 0
    },
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
      // 마우스 가져갈때
    },
  },
  activeLink: {
    backgroundColor: theme.palette.secondary.main,
  },
  itemIcon: {
    width: '40%',
    height: 'auto',
    float: 'left',
    [theme.breakpoints.down('md')]: {
      width: '40%',
      padding: 0,
      margin: 0
    },
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  itemText: {
    margin: '0',
    lineHeight: '30px',
    fontSize: '16px',
    [theme.breakpoints.down('md')]: {
      fontSize: '10px',
    },
    fontWeight: '700',
  },
  whiteFont: {
    color: theme.palette.common.white,
  },
  sidebarWrapper: {
    position: 'relative',
    height: 'calc(100vh - 75px)',
    overflow: 'auto',
    width: '80px',
    zIndex: '4',
    overflowScrolling: 'touch',
  },
  desktopWrapper: {
    zIndex: '3',
  }
});

export default sidebarStyle;
