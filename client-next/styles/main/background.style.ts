import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100vh',
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    willChange: 'top, left, right, bottom',
  },
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  figure1: {
    position: 'absolute',
    background: "url('/main/background/figure1.png') no-repeat center center",
    backgroundSize: 'cover',
    width: 150,
    height: 75,
    animation: '$flow1 1.5s ease-in-out forwards',
    left: '-20%',
    top: '25%',
    [theme.breakpoints.down('sm')]: {
      width: 120,
      height: 60,
    },
    [theme.breakpoints.down('xs')]: {
      animation: '$mobileflow1 1.5s ease-in-out forwards',
    },
  },
  figure2: {
    position: 'absolute',
    background: "url('/main/background/figure2.png') no-repeat center center",
    backgroundSize: 'cover',
    width: 100,
    height: 120,
    animation: '$flow2 2s ease-in-out forwards',
    left: '-20%',
    top: '50%',
    [theme.breakpoints.down('sm')]: {
      width: 75,
      height: 90,
    },
    [theme.breakpoints.down('xs')]: {
      animation: '$mobileflow2 2s ease-in-out forwards',
    },
  },
  figure3: {
    position: 'absolute',
    background: "url('/main/background/figure3.png') no-repeat center center",
    backgroundSize: 'cover',
    width: 410,
    height: 130,
    animation: '$flow3 2.5s ease-in-out forwards',
    opacity: 0.85,
    left: '-20%',
    top: '75%',
    [theme.breakpoints.down('sm')]: {
      width: 307.5,
      height: 97.5,
    },
    [theme.breakpoints.down('xs')]: {
      animation: '$mobileflow3 2.5s ease-in-out forwards',
    },
  },
  figure4: {
    position: 'absolute',
    background: "url('/main/background/figure4.png') no-repeat center center",
    backgroundSize: 'cover',
    width: 400,
    height: 80,
    animation: '$flow4 3s ease-in-out forwards',
    opacity: 0.85,
    left: '-20%',
    top: '78%',
    [theme.breakpoints.down('sm')]: {
      width: 300,
      height: 60,
    },
    [theme.breakpoints.down('xs')]: {
      animation: '$mobileflow4 3s ease-in-out forwards',
    },
  },
  figure5: {
    position: 'absolute',
    background: "url('/main/background/figure5.png') no-repeat center center",
    backgroundSize: 'cover',
    width: 140,
    height: 120,
    animation: '$flow5 1.5s ease-in-out forwards',
    left: '65%',
    bottom: '-20%',
    [theme.breakpoints.down('sm')]: {
      width: 105,
      height: 90,
    },
    [theme.breakpoints.down('xs')]: {
      animation: '$mobileflow5 1.5s ease-in-out forwards',
    },
  },
  figure6: {
    position: 'absolute',
    background: "url('/main/background/figure6.png') no-repeat center center",
    backgroundSize: 'cover',
    width: 50,
    height: 50,
    animation: '$flow6 2s ease-in-out forwards',
    right: '-20%',
    bottom: '40%',
    [theme.breakpoints.down('sm')]: {
      width: 40,
      height: 40,
    },
    [theme.breakpoints.down('xs')]: {
      animation: '$mobileflow6 2s ease-in-out forwards',
    },
  },
  figure7: {
    position: 'absolute',
    background: "url('/main/background/figure7.png') no-repeat center center",
    backgroundSize: 'cover',
    width: 120,
    height: 120,
    animation: '$flow7 3s ease-in-out forwards',
    right: '-20%',
    bottom: '60%',
    [theme.breakpoints.down('sm')]: {
      width: 90,
      height: 90,
    },
    [theme.breakpoints.down('xs')]: {
      animation: '$mobileflow7 3s ease-in-out forwards',
    },
  },
  figure8: {
    position: 'absolute',
    background: "url('/main/background/figure8.png') no-repeat center center",
    backgroundSize: 'cover',
    width: 40,
    height: 240,
    animation: '$flow8 2.5s ease-in-out forwards',
    right: '10%',
    top: '-20%',
    [theme.breakpoints.down('sm')]: {
      width: 30,
      height: 180,
    },
    [theme.breakpoints.down('xs')]: {
      animation: '$mobileflow8 2.5s ease-in-out forwards',
    },
  },
  figure9: {
    position: 'absolute',
    background: "url('/main/background/figure9.png') no-repeat center center",
    backgroundSize: 'cover',
    width: 100,
    height: 100,
    animation: '$flow9 1.5s ease-in-out forwards',
    right: '35%',
    top: '-20%',
    [theme.breakpoints.down('sm')]: {
      width: 75,
      height: 75,
    },
    [theme.breakpoints.down('xs')]: {
      animation: '$mobileflow9 1.5s ease-in-out forwards',
    },
  },
  figure10: {
    position: 'absolute',
    background: "url('/main/background/figure10.png') no-repeat center center",
    backgroundSize: 'cover',
    width: 40,
    height: 180,
    animation: '$flow10 2s ease-in-out forwards',
    right: '65%',
    top: '-20%',
    [theme.breakpoints.down('sm')]: {
      width: 30,
      height: 135,
    },
    [theme.breakpoints.down('xs')]: {
      animation: '$mobileflow10 2s ease-in-out forwards',
    },
  },
  '@keyframes flow1': {
    '0%': {
      left: '-20%',
    },
    '100%': {
      left: '10%',
    },
  },
  '@keyframes flow2': {
    '0%': {
      left: '-20%',
    },
    '100%': {
      left: '25%',
    },
  },
  '@keyframes flow3': {
    '0%': {
      left: '-20%',
    },
    '100%': {
      left: '8%',
    },
  },
  '@keyframes flow4': {
    '0%': {
      left: '0%',
    },
    '100%': {
      left: '8%',
    },
  },
  '@keyframes flow5': {
    '0%': {
      bottom: '-20%',
    },
    '100%': {
      bottom: '20%',
    },
  },
  '@keyframes flow6': {
    '0%': {
      right: '-20%',
    },
    '100%': {
      right: '10%',
    },
  },
  '@keyframes flow7': {
    '0%': {
      right: '-20%',
    },
    '100%': {
      right: '20%',
    },
  },
  '@keyframes flow8': {
    '0%': {
      top: '-20%',
    },
    '100%': {
      top: '5%',
    },
  },
  '@keyframes flow9': {
    '0%': {
      top: '-20%',
    },
    '100%': {
      top: '15%',
    },
  },
  '@keyframes flow10': {
    '0%': {
      top: '-20%',
    },
    '100%': {
      top: '10%',
    },
  },
  '@keyframes mobileflow1': {
    '0%': {
      left: '-20%',
    },
    '100%': {
      left: '5%',
    },
  },
  '@keyframes mobileflow2': {
    '0%': {
      left: '-20%',
    },
    '100%': {
      left: '12.5%',
    },
  },
  '@keyframes mobileflow3': {
    '0%': {
      left: '-60%',
    },
    '100%': {
      left: '-40%',
    },
  },
  '@keyframes mobileflow4': {
    '0%': {
      left: '-60%',
    },
    '100%': {
      left: '-40%',
    },
  },
  '@keyframes mobileflow5': {
    '0%': {
      bottom: '-20%',
    },
    '100%': {
      bottom: '10%',
    },
  },
  '@keyframes mobileflow6': {
    '0%': {
      right: '-20%',
    },
    '100%': {
      right: '5%',
    },
  },
  '@keyframes mobileflow7': {
    '0%': {
      right: '-20%',
    },
    '100%': {
      right: '10%',
    },
  },
  '@keyframes mobileflow8': {
    '0%': {
      top: '-40%',
    },
    '100%': {
      top: '-5%',
    },
  },
  '@keyframes mobileflow9': {
    '0%': {
      top: '-20%',
    },
    '100%': {
      top: '8%',
    },
  },
  '@keyframes mobileflow10': {
    '0%': {
      top: '-20%',
    },
    '100%': {
      top: '1.5%',
    },
  },
}));

export default style;
