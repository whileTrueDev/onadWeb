import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, InputLabel, Input, FormHelperText,
  FormControlLabel, Checkbox, Collapse
} from '@material-ui/core';

import StyledItemText from '../../../../../atoms/StyledItemText';
import Button from '../../../../../atoms/CustomButtons/Button';
import {
  Step3Interface,
  Action
} from '../../../../../pages/mypage/marketer/campaignReducer';

const useStyle = makeStyles((theme: Theme) => ({
  input: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#3c4858',
    margin: '4px'
  },
  inputName: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#3c4858',
  },
  label: {
    fontSize: '20px',
    fontWeight: 700,
    color: theme.palette.primary.light,
    margin: '3px',
  },
}));

interface propInterface {
  handleDialogOpen: () => void;
  dispatch: React.Dispatch<Action>;
  state: Step3Interface
}

const LandingUrlInput = (props: propInterface) => {
  const {
    handleDialogOpen, dispatch, state
  } = props;
  const classes = useStyle();
  const [subOpen, setSubOpen] = React.useState(false);

  const handleSubOpen = () => {
    setSubOpen(!subOpen);
  };

  const handleUrlName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    switch (event.target.id) {
      case 'main-url-name':
        {
          dispatch({ key: 'mainLandingUrlName', value: event.target.value.replace(/ /gi, '') });
          return false;
        }
      case 'sub-url1-name':
        {
          dispatch({ key: 'sub1LandingUrlName', value: event.target.value.replace(/ /gi, '') });
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

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    switch (event.target.id) {
      case 'main-url':
        {
          dispatch({ key: 'mainLandingUrl', value: event.target.value.replace(/ /gi, '') });
          return false;
        }
      case 'sub-url1':
        {
          dispatch({ key: 'sub1LandingUrl', value: event.target.value.replace(/ /gi, '') });
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
    <Grid container direction="column" spacing={3} style={{ marginBottom: 20 }}>
      <InputLabel shrink htmlFor="company" className={classes.label}>MAIN URL</InputLabel>
      <Grid container direction="row">
        <Grid item>
          <InputLabel shrink htmlFor="company">URL 이름</InputLabel>
          <Input
            required
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
            value={state.mainLandingUrl}
            type="url"
            id="main-url"
            className={classes.input}
            onChange={handleUrlChange}
          />
        </Grid>
      </Grid>
      <FormHelperText>랜딩페이지를 통해 시청자들에게 보여질 이름과 접속할 웹페이지를 작성해주세요</FormHelperText>

      <Grid item>
        <FormControlLabel
          control={(
            <Checkbox
              color="primary"
              checked={subOpen}
              onChange={handleSubOpen}
              size="small"
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

      <Grid item>
        <StyledItemText>등록된 URL을 보고싶으신가요?</StyledItemText>
        <Button onClick={handleDialogOpen}>
          나의 인벤토리
        </Button>
      </Grid>
    </Grid>
  );
};

/**
 * @description
 해당 캠페인의 landingUrl을 변경하기 위한 컴포넌트

 * @param {*} state ? landingUrl을 저장하기 위한 object
 * @param {*} dispatch ? landingUrl을 변경하는 func
 * @param {*} handleDialogOpen ? landingUrl을 기존에 저장되어있는 URL을 선택하기 위한 state
 * @param {*} classes ? style

 * @author 박찬우
 */


export default LandingUrlInput;
