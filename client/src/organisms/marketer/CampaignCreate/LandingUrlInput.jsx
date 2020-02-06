import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid, InputLabel, Input, FormHelperText,
  FormControlLabel, Checkbox, Collapse
} from '@material-ui/core';

const formStyle = theme => ({
  input: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#3c4858',
    margin: '4px'
  },
  inputName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#3c4858',
  },
  label: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#00acc1',
    margin: '3px',
  },
});


// const CssFormControl = withStyles({
//   root: {
//     '& label.Mui-focused': {
//       color: '#00acc1',
//     },
//     '& .MuiInput-underline:after': {
//       borderBottomColor: '#00acc1',
//     },
//     '& .MuiOutlinedInput-root': {
//       '&:hover fieldset': {
//         borderColor: '#00acc1',
//       },
//     },
//   },
// })(FormControl);

const LandingUrlInput = (props) => {
  const { classes, dispatch, state } = props;
  const [subOpen, setSubOpen] = React.useState(false);
  // const [sub1CloseState, setSub1CloseState] = React.useState(true);
  // const [sub2CloseState, setSub2CloseState] = React.useState(true);

  const handleSubOpen = () => {
    setSubOpen(!subOpen);
  };

  // const handleCloseState = (event) => {
  //   const targetId = event.target.id;
  //   switch (targetId) {
  //     case 'sub-url1-checkbox': {
  //       setSub1CloseState(!sub1CloseState);
  //       return false;
  //     }
  //     case 'sub-url2-checkbox': {
  //       setSub2CloseState(!sub2CloseState);
  //       return false;
  //     }
  //     default: { return false; }
  //   }
  // };
  const handleUrlName = (event) => {
    switch (event.target.id) {
      case 'main-url-name':
      { dispatch({ key: 'mainLandingUrlName', value: event.target.value.replace(/ /gi, '') });
        return false;
      }
      case 'sub-url1-name':
      { dispatch({ key: 'sub1LandingUrlName', value: event.target.value.replace(/ /gi, '') });
        return false;
      }
      case 'sub-url2-name':
      {
        dispatch({ key: 'sub2LandingUrlName', value: event.target.value.replace(/ /gi, '') });
        return false;
      }
      default:
      { return false; }
    }
  };
  const handleUrlChange = (event) => {
    switch (event.target.id) {
      case 'main-url':
      { dispatch({ key: 'mainLandingUrl', value: event.target.value.replace(/ /gi, '') });
        return false;
      }
      case 'sub-url1':
      { dispatch({ key: 'sub1LandingUrl', value: event.target.value.replace(/ /gi, '') });
        return false;
      }
      case 'sub-url2':
      {
        dispatch({ key: 'sub2LandingUrl', value: event.target.value.replace(/ /gi, '') });
        return false;
      }
      default:
      { return false; }
    }
  };


  return (
    <Grid container direction="column" spacing={3}>
      <InputLabel shrink htmlFor="company" className={classes.label}>MAIN URL</InputLabel>
      <Grid container direction="row">
        <Grid item>
          <InputLabel shrink htmlFor="company">URL 이름</InputLabel>
          <Input
            required
            label="Url 이름"
            id="main-url-name"
            value={state.mainLandingUrlName}
            className={classes.input}
            onChange={handleUrlName}
          />
        </Grid>
        <Grid item>
          <InputLabel shrink htmlFor="company">URL 주소*</InputLabel>
          <Input
            required
            label="Url 주소"
            value={state.mainLandingUrl}
            type="url"
            id="main-url"
            className={classes.input}
            onChange={handleUrlChange}
          />
        </Grid>
      </Grid>
      <FormHelperText>랜딩페이지를 통해 접속할 웹페이지를 작성해주세요</FormHelperText>

      <Grid item style={{ margin: '10px' }}>
        <FormControlLabel
          control={(
            <Checkbox
              color="primary"
              checked={!subOpen}
              onChange={handleSubOpen}
              fontSize="small"
              style={{ padding: '3px' }}
            />
                  )}
          label="SUB URL 설정"
          labelPlacement="end"
        />
      </Grid>

      <Collapse in={subOpen}>
        <Grid item>
          <InputLabel shrink htmlFor="company" className={classes.label}>SUB URL</InputLabel>
          <Grid container direction="row">
            <Grid item>
              <InputLabel shrink htmlFor="company">Sub1 URL 이름</InputLabel>
              <Input
                required
                label="Url 이름"
                id="sub-url1-name"
                value={state.sub1LandingUrlName}
                className={classes.input}
                onChange={handleUrlName}
                // disabled={sub1CloseState}
              />
            </Grid>
            <Grid item>
              <InputLabel shrink htmlFor="company">Sub1 URL 주소</InputLabel>
              <Input
                type="url"
                id="sub-url1"
                value={state.sub1LandingUrl}
                className={classes.input}
                onChange={handleUrlChange}
                // disabled={sub1CloseState}
              />
            </Grid>
            {/* <FormControlLabel
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
            /> */}
          </Grid>

          <Grid container direction="row">
            <Grid item>
              <InputLabel shrink htmlFor="company">Sub2 URL 이름</InputLabel>
              <Input
                required
                label="Url 이름"
                id="sub-url2-name"
                value={state.sub2LandingUrlName}
                className={classes.input}
                onChange={handleUrlName}
                // disabled={sub2CloseState}
              />
            </Grid>
            <Grid item>
              <InputLabel shrink htmlFor="company">Sub2 URL 주소</InputLabel>
              <Input
                type="url"
                id="sub-url2"
                value={state.sub2LandingUrl}
                className={classes.input}
                onChange={handleUrlChange}
                // disabled={sub2CloseState}
              />
            </Grid>
            {/* <FormControlLabel
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
            /> */}
          </Grid>
        </Grid>
      </Collapse>
    </Grid>
  );
};

export default withStyles(formStyle)(LandingUrlInput);
