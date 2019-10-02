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
      width: drawerWidth,
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
      transform: `translate3d(${drawerWidth}px, 0, 0)`,
      ...transition,
    },
  },
  logo: {
    position: 'relative',
    padding: '15px 15px',
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
  },
  logoImage: {
    width: '30px',
    display: 'inline-block',
    maxHeight: '30px',
    marginLeft: '10px',
    marginRight: '15px',
  },
  img: {
    width: '35px',
    top: '22px',
    position: 'absolute',
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
      background: blueGrayColor[9],
    },
  },
  list: {
    display: 'flex',
    height: '100%',
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
    borderTop: `0.05em solid ${grayColor[7]}`,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  item: {
    textDecoration: 'none',
    '&:hover,&:focus,&:visited,&': {
      color: whiteColor,
    },
  },
  itemLink: {
    width: '100%',
    transition: 'all 300ms linear',
    borderRadius: '3px',
    backgroundColor: 'transparent',
    ...defaultFont,
    '&:hover': {
      backgroundColor: '#ff9800',
    },
  },
  itemIcon: {
    // width: '24px',
    // height: '30px',
    widht: '100%',
    height: 'auto',

    fontSize: '30px',
    lineHeight: '30px',
    // float: 'left',
    // marginRight: '15px',
    textAlign: 'center',
    verticalAlign: 'middle',
    color: '#ff9800',
  },
  // hover시에 색깔.
  itemText: {
    ...defaultFont,
    margin: '0',
    lineHeight: '30px',
    fontSize: '14px',
    color: '#ff9800',
    '&:hover': {
      color: '#ff9800',
    },
  },
  whiteFont: {
    color: whiteColor,
  },
  primary: {
    backgroundColor: '#fff',
    ...primaryBoxShadow,
    '&:hover': {
      backgroundColor: '#fff',
      ...primaryBoxShadow,
    },
  },
  info: {
    backgroundColor: infoColor[0],
    boxShadow:
      `0 12px 20px -10px rgba(${
        hexToRgb(infoColor[0])
      },.28), 0 4px 20px 0 rgba(${
        hexToRgb(blackColor)
      },.12), 0 7px 8px -5px rgba(${
        hexToRgb(infoColor[0])
      },.2)`,
    '&:hover': {
      backgroundColor: infoColor[1],
      boxShadow:
        `0 12px 20px -10px rgba(${
          hexToRgb(infoColor[0])
        },.28), 0 4px 20px 0 rgba(${
          hexToRgb(blackColor)
        },.12), 0 7px 8px -5px rgba(${
          hexToRgb(infoColor[0])
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
    width: '180px',
    zIndex: '4',
    overflowScrolling: 'touch',
  },
});

export default sidebarStyle;
