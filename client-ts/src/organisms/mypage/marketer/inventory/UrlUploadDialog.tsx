import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid, InputLabel, Input, FormHelperText,
  FormControlLabel, Checkbox, Collapse,
} from '@material-ui/core';
import Dialog from '../../../../atoms/Dialog/Dialog';
import Button from '../../../../atoms/CustomButtons/Button';
import useToggle from '../../../../utils/hooks/useToggle';
import useEventTargetValue from '../../../../utils/hooks/useEventTargetValue';
import usePostRequest from '../../../../utils/hooks/usePostRequest';
import history from '../../../../history';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  input: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#3c4858',
    margin: '4px'
  },
  label: {
    fontSize: '20px',
    fontWeight: 700,
    color: theme.palette.primary.main,
    marginBottom: '7px',
  },
  checkbox: {

  }
}));

interface propInterface {
  open: boolean;
  handleClose: () => void;
}

export default function UrlUploadDialog(props: propInterface) {
  const classes = useStyles();
  const { open, handleClose } = props;

  const subOpen = useToggle(); // Toggle for sub-urls
  const mainUrl = useEventTargetValue('https://'); // Main url
  const mainUrlName = useEventTargetValue(); // Main url name

  const subUrl = useEventTargetValue('https://'); // Sub url
  const subUrlName = useEventTargetValue(); // sub url name
  const subUrlCheck = useToggle(true); // Sub url2 설정/미설정

  const sub2Url = useEventTargetValue('https://'); // Sub url2
  const sub2UrlName = useEventTargetValue(); // Sub url2 name
  const sub2UrlCheck = useToggle(true); // Sub url2 설정/미설정


  const { doPostRequest } = usePostRequest<{
    links: {
      primary: boolean;
      linkName: string;
      linkTo: string;
    }[]
  }, any[]>(
    '/marketer/landing-url',
    // success callback function
    () => { handleClose(); history.push('/mypage/marketer/inventory'); }
  );


  function handleSubmit() {
    const linkResult = [];
    linkResult.push({ primary: true, linkName: mainUrlName.value, linkTo: mainUrl.value });
    if (!subUrlCheck.toggle) {
      linkResult.push({ primary: false, linkName: subUrlName.value, linkTo: subUrl.value });
    }
    if (!sub2UrlCheck.toggle) {
      linkResult.push({ primary: false, linkName: sub2UrlName.value, linkTo: sub2Url.value });
    }
    doPostRequest({ links: linkResult });
  }

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth
      title="URL 등록"
      buttons={(
        <div style={{ display: 'flex' }}>
          <Collapse
            in={(/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/
              .test(mainUrl.value))}
          >
            <Button
              color="primary"
              disabled={// from https://regexr.com/3um70
                !(/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/
                  .test(mainUrl.value))
              }
              onClick={handleSubmit}
            >
              등록
            </Button>
          </Collapse>
          <Button onClick={handleClose}>취소</Button>
        </div>
      )}
    >
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
        <FormHelperText>랜딩페이지를 통해 접속할 웹페이지를 작성해주세요</FormHelperText>

        <Grid item>
          <FormControlLabel
            control={(
              <Checkbox
                color="primary"
                checked={subOpen.toggle}
                onChange={() => {
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
              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    id="sub-url1-checkbox"
                    checked={subUrlCheck.toggle}
                    onChange={subUrlCheck.handleToggle}
                    size="small"
                    className={classes.checkbox}
                  />
                )}
                label="미설정"
                labelPlacement="start"
              />
            </Grid>

            <Grid container direction="row">
              <Grid item>
                <InputLabel shrink htmlFor="company">Sub2 URL 이름</InputLabel>
                <Input
                  required
                  id="sub-url2-name"
                  className={classes.input}
                  value={sub2UrlName.value}
                  onChange={sub2UrlName.handleChange}
                  disabled={sub2UrlCheck.toggle}
                />
              </Grid>
              <Grid item>
                <InputLabel shrink htmlFor="company">Sub2 URL 주소</InputLabel>
                <Input
                  id="sub-url2"
                  className={classes.input}
                  value={sub2Url.value}
                  onChange={sub2Url.handleChange}
                  disabled={sub2UrlCheck.toggle}
                />
              </Grid>
              <FormControlLabel
                control={(
                  <Checkbox
                    color="primary"
                    id="sub-url2-checkbox"
                    checked={sub2UrlCheck.toggle}
                    onChange={sub2UrlCheck.handleToggle}
                    size="small"
                    className={classes.checkbox}
                  />
                )}
                label="미설정"
                labelPlacement="start"
              />
            </Grid>
          </Grid>
        </Collapse>
      </Grid>
    </Dialog>
  );
}
