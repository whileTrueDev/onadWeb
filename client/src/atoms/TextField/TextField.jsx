import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';

const CssTextField = withStyles({
  root: {
    color: '#00acc1',
    borderColor: '#00acc1',
    '& .MuiFormLabel-root ': {
      color: '#00acc1',
    },
    '& .MuiInputBase-input:before': {
      color: '#00acc1',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#00acc1',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#00acc1',
      },
      '&:hover fieldset': {
        borderColor: '#00acc1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#00acc1',
      },
    },
  },
})(TextField);

export default CssTextField;
