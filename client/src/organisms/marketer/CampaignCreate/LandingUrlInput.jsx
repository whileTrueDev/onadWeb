import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid, InputLabel, Input, FormHelperText, FormControl, FormControlLabel, Checkbox
} from '@material-ui/core';

const formStyle = theme => ({
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
  const { classes, dispatch, } = props;
  const [sub1CloseState, setSub1CloseState] = React.useState(true);
  const [sub2CloseState, setSub2CloseState] = React.useState(true);

  const handleCloseState = (event) => {
    const targetId = event.target.id;
    switch (targetId) {
      case 'sub-url1-checkbox': {
        setSub1CloseState(!sub1CloseState);
        return false;
      }
      case 'sub-url2-checkbox': {
        setSub2CloseState(!sub2CloseState);
        return false;
      }
      default: { return false; }
    }
  };

  const handleUrlChange = (event) => {
    switch (event.target.id) {
      case 'main-url':
      { dispatch({ key: 'mainLandingUrl', value: event.target.value });
        return false;
      }
      case 'sub-url1':
      { dispatch({ key: 'sub1LandingUrl', value: event.target.value });
        return false;
      }
      case 'sub-url2':
      {
        dispatch({ key: 'sub2LandingUrl', value: event.target.value });
        return false;
      }
      default:
      { return false; }
    }
  };


  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <CssFormControl
          required
        >
          <InputLabel shrink htmlFor="company" className={classes.label}> MAIN URL</InputLabel>
          <Input
            required
            defaultValue="https://"
            type="url"
            id="main-url"
            className={classes.input}
            onChange={handleUrlChange}
          />

          <FormHelperText>랜딩페이지를 통해 접속할 웹페이지를 작성해주세요</FormHelperText>
        </CssFormControl>
      </Grid>

      <Grid item>
        <InputLabel shrink htmlFor="company" className={classes.label}> SUB URL</InputLabel>

        Sub1.
        <Input
          defaultValue="https://"
          type="url"
          id="sub-url1"
          className={classes.input}
          onChange={handleUrlChange}
          disabled={sub1CloseState}
        />
        <FormControlLabel
          control={(
            <Checkbox
              color="primary"
              id="sub-url1-checkbox"
              checked={sub1CloseState}
              onChange={handleCloseState}
              fontSize="small"
              style={{ padding: '3px' }}
            />
                  )}
          label="미설정"
          labelPlacement="start"
        />
      </Grid>
      <Grid item>
        Sub2.
        <Input
          defaultValue="https://"
          type="url"
          id="sub-url2"
          className={classes.input}
          onChange={handleUrlChange}
          disabled={sub2CloseState}
        />
        <FormControlLabel
          control={(
            <Checkbox
              color="primary"
              id="sub-url2-checkbox"
              checked={sub2CloseState}
              onChange={handleCloseState}
              fontSize="small"
              style={{ padding: '3px' }}
            />
                  )}
          label="미설정"
          labelPlacement="start"
        />
      </Grid>

    </Grid>
  );
};

export default withStyles(formStyle)(LandingUrlInput);
