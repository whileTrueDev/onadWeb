import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255, 0.6)'
  },
  contentWrapper: {
    backgroundColor: 'rgb(255,255,255,0.2)',
    borderRadius: '20px',
    boxShadow: '0px 0px 3px 2px rgba(255,255,255,0.2)',
  },
  content: {
    width: 220,
    height: 160,
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: 180,
      height: 130,
    },
    [theme.breakpoints.down('xs')]: {
      width: 150,
      height: 110,
    }
  },
  text: {
    color: 'white',
    marginBottom: theme.spacing(2),
  },
  count: {
    color: 'white',
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('xs')]: {
      fontSize: 22
    }
  },
  box1: {
    background: 'linear-gradient(to right, #20BFE2, #44A0E7)',
    animation: '$flowTop1 3s ease-in-out forwards',
    [theme.breakpoints.down('xs')]: {
      animation: 'none'
    }
  },
  '@keyframes flowTop1': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(0, -70px)' },
  },
  box2: {
    background: 'linear-gradient(to right, #40A4E6, #6384EB)',
    animation: '$flowTop2 3s ease-in-out forwards',
    [theme.breakpoints.down('xs')]: {
      animation: 'none'
    }
  },
  '@keyframes flowTop2': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(0, -30px)' },
  },
  box3: {
    background: 'linear-gradient(to right, #6088EA, #826AEF)',
    animation: '$flowTop3 3s ease-in-out forwards',
    [theme.breakpoints.down('xs')]: {
      animation: 'none'
    }
  },
  '@keyframes flowTop3': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(0, -100px)' },
  },
  box4: {
    background: 'linear-gradient(to right, #7E6DEE, #A34DF4)',
    animation: '$flowTop4 3s ease-in-out forwards',
    [theme.breakpoints.down('xs')]: {
      animation: 'none'
    }
  },
  '@keyframes flowTop4': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(0, -40px)' },
  },

}));

export default useStyles;
