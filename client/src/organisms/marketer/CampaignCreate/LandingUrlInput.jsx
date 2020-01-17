import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid, InputLabel, Input, FormHelperText, FormControl, Divider
} from '@material-ui/core';
import StyledItemText from '../../../atoms/StyledItemText';

const formStyle = theme => ({
  // imgPreview: {
  //   width: '100%',
  //   [theme.breakpoints.down('xs')]: {
  //     maxHeight: '200px',
  //   },
  //   [theme.breakpoints.up('sm')]: {
  //     maxWidth: '350px',
  //     maxHeight: '300px',
  //   },
  // },
  input: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#3c4858',
  },
  label: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#00acc1',
    marginBottom: '7px',
  },
});


const CssFormControl = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#00acc1',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#00acc1',
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#00acc1',
      },
    },
  },
})(FormControl);

const LandingUrlInput = (props) => {
  const { classes } = props;
  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <CssFormControl
          required
        >
          <InputLabel shrink htmlFor="company" className={classes.label}>URL</InputLabel>
          <Input
            required
            defaultValue="https://"
            type="url"
            id="url"
            className={classes.input}
          />

          <FormHelperText>랜딩페이지를 통해 접속할 웹페이지를 작성해주세요</FormHelperText>
        </CssFormControl>
      </Grid>
      <Divider component="hr" style={{ height: '2px' }} />

    </Grid>
  );
};

export default withStyles(formStyle)(LandingUrlInput);
