import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';


const PrettoSlider = withStyles((theme) => ({
  root: {
    color: theme.palette.success.main,
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: theme.palette.common.white,
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    zIndex: 1,
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
}))(Slider);

export default PrettoSlider;
