import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import {
  Grid, InputLabel, Input, FormHelperText,
  FormControlLabel, Checkbox, Collapse,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  input: {
    fontSize: '14px',
    fontWeight: 700,
    color: theme.palette.text.primary,
    margin: '4px'
  },
  label: {
    fontSize: '20px',
    fontWeight: 700,
    color: theme.palette.primary.main,
    marginBottom: '7px',
  },
  checkbox: {

  },
  buttonSet: {
    maginTop: '16px'
  },
}));

const UrlUploadStep = (props: any): JSX.Element => {
  const classes = useStyles();
  const {
    mainUrlName, mainUrl, subOpen, subUrlName, subUrl, subUrlCheck,
  } = props;
  return (
    <Grid container direction="column" spacing={3} className={classes.root}>
      <InputLabel shrink htmlFor="company" className={classes.label}>MAIN URL</InputLabel>
      <Grid container direction="row">
        <Grid item>
          <InputLabel shrink htmlFor="company">URL 이름</InputLabel>
          <Input
            required
            id="main-url-name"
            className={classes.input}
            value={mainUrlName.value}
            onChange={mainUrlName.handleChange}
          />
        </Grid>
        <Grid item>
          <InputLabel shrink htmlFor="company">URL 주소*</InputLabel>
          <Input
            required
            id="main-url"
            className={classes.input}
            value={mainUrl.value}
            onChange={mainUrl.handleChange}
          />
        </Grid>
      </Grid>
      <FormHelperText>* 시청자가 광고채팅 또는 패널 클릭시 접속될 웹페이지를 작성해주세요</FormHelperText>
      <FormHelperText>* URL 이름은 광고채팅의 접두어로 사용되어, 시청자에게 직접적으로 보여집니다.</FormHelperText>

      <Grid item>
        <FormControlLabel
          control={(
            <Checkbox
              color="primary"
              disabled
              checked={subOpen.toggle}
              onChange={(): void => {
                subOpen.handleToggle(); // sub url1 칸 열기
                subUrlCheck.handleToggle(); // sub url1 disabled 풀기
              }}
              size="small"
              className={classes.checkbox}
            />
          )}
          label="SUB URL 설정"
          labelPlacement="end"
        />
        <FormHelperText>SUB URL은 향후 CPA 상품 개발 시 사용될 예정입니다.</FormHelperText>
      </Grid>

      <Collapse in={subOpen.toggle}>
        <Grid item>
          <InputLabel shrink htmlFor="company" className={classes.label}>SUB URL</InputLabel>
          <Grid container direction="row">
            <Grid item>
              <InputLabel shrink htmlFor="company">Sub1 URL 이름</InputLabel>
              <Input
                required
                id="sub-url1-name"
                className={classes.input}
                value={subUrlName.value}
                onChange={subUrlName.handleChange}
                disabled={subUrlCheck.toggle}
              />
            </Grid>
            <Grid item>
              <InputLabel shrink htmlFor="company">Sub1 URL 주소</InputLabel>
              <Input
                id="sub-url1"
                className={classes.input}
                value={subUrl.value}
                onChange={subUrl.handleChange}
                disabled={subUrlCheck.toggle}
              />
            </Grid>
          </Grid>
        </Grid>
      </Collapse>
    </Grid>
  );
};
export default UrlUploadStep;
