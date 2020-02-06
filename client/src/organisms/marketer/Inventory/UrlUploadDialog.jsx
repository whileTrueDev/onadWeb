import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Grid, InputLabel, Input, FormHelperText,
  FormControlLabel, Checkbox, Collapse, Tooltip
} from '@material-ui/core';
import Dialog from '../../../atoms/Dialog/Dialog';
import Button from '../../../atoms/CustomButtons/Button';
import useToggle from '../../../utils/lib/hooks/useToggle';
import useEventTargetValue from '../../../utils/lib/hooks/useEventTargetValue';
import useUpdateData from '../../../utils/lib/hooks/useUpdateData';
import history from '../../../history';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  input: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#3c4858',
    margin: '4px'
  },
  label: {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.palette.primary.main,
    marginBottom: '7px',
  },
}));

export default function UrlUploadDialog(props) {
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

  const urlUpload = useUpdateData(
    '/api/dashboard/marketer/inventory/landingurl/regist',
    // success callback function
    () => { handleClose(); history.push('/dashboard/marketer/inventory'); }
  );

  function handleSubmit() {
    const linkResult = [];
    linkResult.push({ primary: true, linkName: mainUrlName.value, linkTo: mainUrl.value });
    if (!subUrlCheck.toggle) {
      linkResult.push([{ primary: false, linkName: subUrlName.value, linkTo: subUrl.value }]);
    }
    if (!sub2UrlCheck.toggle) {
      linkResult.push([{ primary: false, linkName: sub2UrlName.value, linkTo: sub2Url.value }]);
    }
    urlUpload.handleUpdateRequest({ links: linkResult });
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
          <Tooltip
            title="올바른 URL 형식을 적어주세요."
            open={!(/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/
              .test(mainUrl.value))
            }
          >
            <div>
              <Button
                color="info"
                disabled={// from https://regexr.com/3um70
                !(/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/
                  .test(mainUrl.value))
                }
                onClick={handleSubmit} // api 서버에 데이터 전송 | 적재
              >
              등록
              </Button>
            </div>
          </Tooltip>
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
              label="Url 이름"
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
              label="Url 주소"
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
                fontSize="small"
                style={{ padding: '3px' }}
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
                  label="Url 이름"
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
                    fontSize="small"
                    style={{ padding: '3px' }}
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
                  label="Url 이름"
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
                    fontSize="small"
                    style={{ padding: '3px' }}
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
