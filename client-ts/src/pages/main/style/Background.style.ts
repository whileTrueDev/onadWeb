import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    willChange: 'top, left, right, bottom'
  },
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  },
  figure1: {
    position: 'absolute',
    background: 'url(\'/parallaxBg/figure1.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: 150,
    height: 75,
    animation: '$flow1 1.5s ease-in-out forwards',
    left: '-20%',
    top: '25%'
  },
  figure2: {
    position: 'absolute',
    background: 'url(\'/parallaxBg/figure2.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: 100,
    height: 120,
    animation: '$flow2 2s ease-in-out forwards',
    left: '-20%',
    top: '50%'
  },
  figure3: {
    position: 'absolute',
    background: 'url(\'/parallaxBg/figure3.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: 410,
    height: 130,
    animation: '$flow3 2.5s ease-in-out forwards',
    opacity: 0.85,
    left: '-20%',
    top: '75%'
  },
  figure4: {
    position: 'absolute',
    background: 'url(\'/parallaxBg/figure4.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: 400,
    height: 80,
    animation: '$flow4 3s ease-in-out forwards',
    opacity: 0.85,
    left: '-20%',
    top: '78%'
  },
  figure5: {
    position: 'absolute',
    background: 'url(\'/parallaxBg/figure5.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: 140,
    height: 120,
    animation: '$flow5 1.5s ease-in-out forwards',
    left: '65%',
    bottom: '-20%'
  },
  figure6: {
    position: 'absolute',
    background: 'url(\'/parallaxBg/figure6.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: 50,
    height: 50,
    animation: '$flow6 2s ease-in-out forwards',
    right: '-20%',
    bottom: '40%'
  },
  figure7: {
    position: 'absolute',
    background: 'url(\'/parallaxBg/figure7.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: 120,
    height: 120,
    animation: '$flow7 3s ease-in-out forwards',
    right: '-20%',
    bottom: '60%'
  },
  figure8: {
    position: 'absolute',
    background: 'url(\'/parallaxBg/figure8.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: 40,
    height: 240,
    animation: '$flow8 2.5s ease-in-out forwards',
    right: '10%',
    top: '-20%'
  },
  figure9: {
    position: 'absolute',
    background: 'url(\'/parallaxBg/figure9.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: 100,
    height: 100,
    animation: '$flow9 1.5s ease-in-out forwards',
    right: '35%',
    top: '-20%'
  },
  figure10: {
    position: 'absolute',
    background: 'url(\'/parallaxBg/figure10.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: 40,
    height: 180,
    animation: '$flow10 2s ease-in-out forwards',
    right: '65%',
    top: '-20%'
  },
  '@keyframes flow1': {
    '0%': {
      left: '-20%',
    },
    '100%': {
      left: '10%',
    }
  },
  '@keyframes flow2': {
    '0%': {
      left: '-20%',
    },
    '100%': {
      left: '25%',
    }
  },
  '@keyframes flow3': {
    '0%': {
      left: '-20%',
    },
    '100%': {
      left: '8%',
    }
  },
  '@keyframes flow4': {
    '0%': {
      left: '0%'
    },
    '100%': {
      left: '8%'
    }
  },
  '@keyframes flow5': {
    '0%': {
      bottom: '-20%'
    },
    '100%': {
      bottom: '20%'
    }
  },
  '@keyframes flow6': {
    '0%': {
      right: '-20%',
    },
    '100%': {
      right: '10%',
    }
  },
  '@keyframes flow7': {
    '0%': {
      right: '-20%',
    },
    '100%': {
      right: '20%',
    }
  },
  '@keyframes flow8': {
    '0%': {
      top: '-20%'
    },
    '100%': {
      top: '5%'
    }
  },
  '@keyframes flow9': {
    '0%': {
      top: '-20%'
    },
    '100%': {
      top: '15%'
    }
  },
  '@keyframes flow10': {
    '0%': {
      top: '-20%'
    },
    '100%': {
      top: '10%'
    }
  },
}));

export default style;
