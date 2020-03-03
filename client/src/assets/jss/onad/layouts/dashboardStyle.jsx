import {
  drawerWidth,
} from '../../onad';

const appStyle = (theme) => ({
  wrapper: {
    position: 'relative',
    top: '0',
    height: '100vh',
  },
  mainPanel: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    overflow: 'auto',
    position: 'relative',
    float: 'right',
    transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
    maxHeight: '100%',
    width: '100%',
    overflowScrolling: 'touch',
    backgroundColor: theme.palette.background.default,
  },
  content: {
    marginTop: '70px',
    padding: '15px 15px',
    minHeight: 'calc(100vh - 123px)',
  },
  container: {
    paddingRight: '15px',
    paddingLeft: '15px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

export default appStyle;
