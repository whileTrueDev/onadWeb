import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 1,
    background: 'white',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    '&:before': {
      willChange: 'transform, marignTop'
    }
  },
  rowCenterAlign: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  columnCenterAlign: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentWrapper: {
    position: 'absolute',
    maxWidth: '100%',
    maxHeight: '100%',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    padding: '0 10%',
    [theme.breakpoints.down('md')]: {
      padding: '0 5%'
    },
  },
  mainTitle: {
    [theme.breakpoints.down('md')]: {
      fontSize: '35px !important',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '30px !important',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '35px !important',
    },
  },
  content: {
    width: '100%',
    height: 650,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
  },
  leftContent: {
    width: 400,
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      width: 260,
      height: 380,
    },
  },
  rightContent: {
    width: 700,
    height: 'auto',
    zIndex: 100,
    [theme.breakpoints.down('md')]: {
      width: 650,
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  InnerLeft: {
    width: 400,
    height: 240,
    borderRadius: theme.spacing(1),
    background: `linear-gradient(to bottom, white, #eff4f9 60%, #d8fff7 120%)`,
    boxShadow: '0px 2px 4px 4px rgba(0,0,0,0.02)',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      width: 350,
      height: 210,
    },
    [theme.breakpoints.down('xs')]: {
      width: 280,
      height: 168,
    },
  },
  mainCharacter: {
    zIndex: 250,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 300,
    height: 300,
    [theme.breakpoints.down('xs')]: {
      width: 200,
      height: 200,
    },
  },
  banner: {
    zIndex: 300,
    '&>*': {
      color: 'white',
    },
    width: 120,
    height: 50,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    right: theme.spacing(1),
    bottom: theme.spacing(3),
    background: 'linear-gradient(60deg, #4481eb, #04befe)',
    borderRadius: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      width: 96,
      height: 40,
    },
  },
  InnerLeftBottom: {
    width: 400,
    height: 50,
    zIndex: 1000,
    marginTop: theme.spacing(3),
    borderRadius: theme.spacing(1),
    backgroundColor: 'white',
    boxShadow: '0px 2px 4px 4px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: 350,
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
  },
  InnerRight: {
    width: 250,
    height: 314,
    marginLeft: theme.spacing(5),
    backgroundColor: 'white',
    borderRadius: theme.spacing(1),
    boxShadow: '0px 2px 4px 4px rgba(0,0,0,0.02)',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
  },
  flipWrapper: {
    height: 270,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flip: {
    animation: '$flip 8s cubic-bezier(0.23, 1, 0.32, 1.2) forwards',
  },
  '@keyframes flip': {
    '0%': { marginTop: '560px'},
    '5%, 20%': { marginTop: '440px'},
    '25%, 50%': { marginTop: '330px'},
    '55%, 60%': { marginTop: '210px'},
    '65%, 90%': { marginTop: '120px'},
    '95%, 100%': { marginTop: '8px'},
  },
  logo: {
    padding: theme.spacing(3, 0)
  },
  onadLogo: {
    width: 36,
    height: 36,
    margin: theme.spacing(0, 1)
  },
  buttonWrapper: {
    marginTop: theme.spacing(3),
    zIndex: 100,
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(0),
    },
  },
  button: {
    marginTop: `${theme.spacing(3)}px !important`,
    width: 250,
    height: 60,
    borderRadius: `${theme.spacing(2)}px !important`,
    boxShadow: '0px 2px 5px 3px rgba(0,0,0,0.08)',
    [theme.breakpoints.down('md')]: {
      width: 200,
    },
    [theme.breakpoints.down('xs')]: {
      width: 200,
      height: 50,
      backgroundColor: `${theme.palette.common.white} !important`
    },
  },
  buttonText: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '20px !important'
    },
  },
  chatting: {
    margin: theme.spacing(0.5, 2)
  },
  chattingBottom: {
    width: '90%',
    height: 25,
    marginTop: theme.spacing(1.5),
    background: theme.palette.divider,
    borderRadius: theme.spacing(3),
    zIndex: 200,
    position: 'absolute',
    bottom: theme.spacing(1.5),
    left: '5%',
    opacity: 0.5,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '&>div': {
      width: '15%',
      height: 15,
      borderRadius: theme.spacing(3),
      background: 'white',
      marginRight: theme.spacing(1)
    }
  },
  bottomText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  bgParent: {
    position: 'relative',
    width: 1600,
    height: 1600,
    left: '30%',
    top: '-60%',
    background: `url('/door/bluetouch.svg') no-repeat`,
    backgroundSize: 'cover',
    animation: '$downwardleft 4s ease-in-out forwards',
    '&:after': {
      content: '""',
      position: 'absolute',
      zIndex: 0,
      width: 1600,
      height: 1600,
      left: '-32.5%',
      bottom: '-80%',
      transform: 'translate(0,0) rotate(180deg)',
      background: `url('/door/greentouch.svg') no-repeat`,
      backgroundSize: 'cover',
      animation: '$UpwardRight 4s ease-in-out forwards',
      [theme.breakpoints.down('sm')]: {
        width: 1200,
        height: 1200,
        left: '-38%',
        bottom: '-76%',
      },
      [theme.breakpoints.down('xs')]: {
        width: 900,
        height: 900,
        left: '-150%',
        bottom: '-97%',
      },
    },
    [theme.breakpoints.down('sm')]: {
      width: 1200,
      height: 1200,
    },
    [theme.breakpoints.down('xs')]: {
      width: 900,
      height: 900,
      left: '32%',
      top: '-30%',
    },
  },
  '@keyframes downwardleft': {
    '0%': {
      transform: 'translate(0,0)',
    },
    '100%': {
      transform: 'translate(-100px,100px)',
    },
  },
  '@keyframes UpwardRight': {
    '0%': {
      transform: 'translate(0,0) rotate(180deg)',
    },
    '100%': {
      transform: 'translate(120px, -120px) rotate(180deg)',
    },
  },
  wave: {
    width: '100%',
    height: 300,
    position: 'absolute',
    left: 0,
    bottom: '10%',
    [theme.breakpoints.down('xs')]: {
      bottom: '-2%',
    },
  },
}));

export default useStyles;
