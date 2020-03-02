import { Theme } from '@material-ui/core/styles';

const buttonStyle = (theme: Theme) => ({
  button: {
    border: 'none',
    margin: '.3125rem 1px',
    willChange: 'box-shadow, transform',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    touchAction: 'manipulation',
  }
});

export default buttonStyle;
