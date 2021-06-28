import { makeStyles } from '@material-ui/core/styles';

const useButtonStyles = makeStyles(() => ({
  button: {
    border: 'none',
    margin: '.3125rem 1px',
    willChange: 'box-shadow, transform',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    touchAction: 'manipulation',
  },
}));

export default useButtonStyles;
