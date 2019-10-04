import {
  drawerWidth,
  transition,
  boxShadow,
  defaultFont,
  primaryColor,
  primaryBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  blueGrayColor,
  whiteColor,
  grayColor,
  blackColor,
  hexToRgb,
} from '../../onad';

const sidebarStyle = theme => ({
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
    ...boxShadow,
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'fixed',
      height: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '80px',
      ...boxShadow,
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
      ...transition,
    },
  },
  desktopPaper: {
    overflow: false,
    border: 'none',
    top: '0',
    bottom: '0',
    left: '0',
    zIndex: '1',
    ...boxShadow,
    width: drawerWidth,
  },
  logo: {
    position: 'relative',
    // padding: '15px 15px',
    zIndex: '4',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      height: '1px',
      right: '15px',
      width: 'calc(100% - 30px)',
      backgroundColor: `rgba(${hexToRgb(grayColor[6])}, 0해.3)`,
    },
  },
  desktopLogo: {
    zIndex: '4',
    // padding: '0'
  },
  logoLink: {
    ...defaultFont,
    padding: '5px 0',
    display: 'block',
    fontSize: '20px',
    textAlign: 'left',
    fontWeight: '400',
    lineHeight: '30px',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    color: whiteColor,
    '&:hover': {
      color: grayColor[5],
    },
    // marginBottom: '30px',
    // backgroundColor: '#ff9800'
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
    backgroundColor: '#ff9800'
  },
  head: {
    width: '100%',
    marginTop: '15px',
    padding: '0',
    margin: '0',
    zIndex: '4',
    marginBottom: '30px',
    backgroundColor: '#ff9800'
  },
  logoImage: {
    width: '100%',
    display: 'inline-block',
    marginLeft: '10px',
    marginRight: '15px',
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
  desktopBackground: {
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
  list: {
    display: 'flex',
    height: '90%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: '20px',
    paddingLeft: '0',
    paddingTop: '0',
    paddingBottom: '0',
    marginBottom: '0',
    listStyle: 'none',
    position: 'unset',
  },
  linkWrapper: {},
  NavBarLinksWrapper: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    borderTop: `0.05em solid ${'#fff'}`,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  item: {
    position: 'relative',
    display: 'block',
    textDecoration: 'none',
    '&:hover,&:focus,&:visited,&': {
      color: '#000',
    },
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
    ...defaultFont,
    '&:hover': {
      backgroundColor: '#ffc166',
      // 마우스 가져갈때
    },
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
    ...defaultFont,
    margin: '0',
    lineHeight: '30px',
    fontSize: '16px',
    [theme.breakpoints.down('md')]: {
      fontSize: '10px',
    },
    fontWeight: '700',
  },
  whiteFont: {
    color: whiteColor,
  },
  primary: {
    backgroundColor: primaryColor[0],
    ...primaryBoxShadow,
    '&:hover': {
      backgroundColor: primaryColor[0],
      ...primaryBoxShadow,
    },
  },
  info: {
    backgroundColor: '#ff9800',
    boxShadow:
      `0 12px 20px -10px rgba(${
        hexToRgb('#ff9800')
      },.28), 0 4px 20px 0 rgba(${
        hexToRgb(blackColor)
      },.12), 0 7px 8px -5px rgba(${
        hexToRgb('#ff9800')
      },.2)`,
    '&:hover': {
      backgroundColor: '#ff9800',
      boxShadow:
        `0 12px 20px -10px rgba(${
          hexToRgb('#ff9800')
        },.28), 0 4px 20px 0 rgba(${
          hexToRgb(blackColor)
        },.12), 0 7px 8px -5px rgba(${
          hexToRgb('#ff9800')
        },.2)`,
    },
  },
  success: {
    backgroundColor: successColor[0],
    boxShadow:
      `0 12px 20px -10px rgba(${
        hexToRgb(successColor[0])
      },.28), 0 4px 20px 0 rgba(${
        hexToRgb(blackColor)
      },.12), 0 7px 8px -5px rgba(${
        hexToRgb(successColor[0])
      },.2)`,
    '&:hover': {
      backgroundColor: successColor[1],
      boxShadow:
        `0 12px 20px -10px rgba(${
          hexToRgb(successColor[0])
        },.28), 0 4px 20px 0 rgba(${
          hexToRgb(blackColor)
        },.12), 0 7px 8px -5px rgba(${
          hexToRgb(successColor[0])
        },.2)`,
    },
  },
  warning: {
    backgroundColor: warningColor[0],
    boxShadow:
      `0 12px 20px -10px rgba(${
        hexToRgb(warningColor[0])
      },.28), 0 4px 20px 0 rgba(${
        hexToRgb(blackColor)
      },.12), 0 7px 8px -5px rgba(${
        hexToRgb(warningColor[0])
      },.2)`,
    '&:hover': {
      backgroundColor: warningColor[1],
      boxShadow:
        `0 12px 20px -10px rgba(${
          hexToRgb(warningColor[0])
        },.28), 0 4px 20px 0 rgba(${
          hexToRgb(blackColor)
        },.12), 0 7px 8px -5px rgba(${
          hexToRgb(warningColor[0])
        },.2)`,
    },
  },
  danger: {
    backgroundColor: dangerColor[0],
    boxShadow:
      `0 12px 20px -10px rgba(${
        hexToRgb(dangerColor[0])
      },.28), 0 4px 20px 0 rgba(${
        hexToRgb(blackColor)
      },.12), 0 7px 8px -5px rgba(${
        hexToRgb(dangerColor[0])
      },.2)`,
    '&:hover': {
      backgroundColor: dangerColor[1],
      boxShadow:
        `0 12px 20px -10px rgba(${
          hexToRgb(dangerColor[0])
        },.28), 0 4px 20px 0 rgba(${
          hexToRgb(blackColor)
        },.12), 0 7px 8px -5px rgba(${
          hexToRgb(dangerColor[0])
        },.2)`,
    },
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
