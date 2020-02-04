import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Grid, InputLabel, Input, FormHelperText,
  FormControlLabel, Checkbox, FormControl, Tooltip
} from '@material-ui/core';
import Dialog from '../../../atoms/Dialog/Dialog';
import Button from '../../../atoms/CustomButtons/Button';
import useToggle from '../../../utils/lib/hooks/useToggle';
import useEventTargetValue from '../../../utils/lib/hooks/useEventTargetValue';
import useUpdateData from '../../../utils/lib/hooks/useUpdateData';

const useStyles = makeStyles(theme => ({
  input: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#3c4858',
  },
  label: {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.palette.primary.main,
    marginBottom: '7px',
  },
}));

const CssFormControl = withStyles(theme => ({
  root: {
    '& label.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}))(FormControl);

export default function UrlUploadDialog(props) {
  const classes = useStyles();
  const { open, handleClose } = props;

  const mainUrl = useEventTargetValue();
  const mainUrlName = useEventTargetValue();

  const check1Toggle = useToggle();
  const subUrl = useEventTargetValue();
  const subUrlName = useEventTargetValue();
  const check2Toggle = useToggle();
  const sub2Url = useEventTargetValue();
  const sub2UrlName = useEventTargetValue();

  const urlUpload = useUpdateData(
    '/api/dashboard/marketer/inventory/landingurl/regist'
  );

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth
      title="URL 등록"
      buttons={(
        <div style={{ display: 'flex' }}>
          <Tooltip title="mainUrl을 기입하지 않으면 등록할 수 없습니다.">
            <div>
              <Button
                color="info"
                disabled={mainUrl}
                onClick={() => {
                  urlUpload.handleUpdateRequest({
                    links: [
                      { primary: true, }
                    ],
                  });
                }}
              >
                등록
              </Button>
            </div>
          </Tooltip>
          <Button onClick={handleClose}>취소</Button>
        </div>
      )}
    >
      <Grid container direction="column" spacing={3}>
        {/* Main URL */}
        <Grid item>
          <CssFormControl required>
            <InputLabel shrink htmlFor="company" className={classes.label}> MAIN URL</InputLabel>
            <Input
              required
              defaultValue=""
              type="text"
              id="main-url-name"
              className={classes.input}
              onChange={mainUrlName.handleChange}
            />

            <Input
              required
              defaultValue="https://"
              type="url"
              id="main-url"
              className={classes.input}
              onChange={mainUrl.handleChange}
            />

            <FormHelperText>랜딩페이지를 통해 접속할 웹페이지를 작성해주세요</FormHelperText>
          </CssFormControl>
        </Grid>

        <Grid item>
          <InputLabel shrink htmlFor="company" className={classes.label}> SUB URL</InputLabel>
          Sub1.
          {/* SUB 1 URL */}
          <Input
            defaultValue="https://"
            type="url"
            id="sub-url1"
            className={classes.input}
            onChange={subUrl.handleChange}
            disabled={check1Toggle.toggle}
          />
          <FormControlLabel
            control={(
              <Checkbox
                color="primary"
                id="sub-url1-checkbox"
                checked={check1Toggle.toggle}
                onChange={check1Toggle.handleToggle}
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
          {/* SUB 2 URL */}
          <Input
            defaultValue="https://"
            type="url"
            id="sub-url2"
            className={classes.input}
            onChange={sub2Url.handleChange}
            disabled={check2Toggle.toggle}
          />
          <FormControlLabel
            control={(
              <Checkbox
                color="primary"
                id="sub-url2-checkbox"
                checked={check2Toggle.toggle}
                onChange={check2Toggle.handleToggle}
                fontSize="small"
                style={{ padding: '3px' }}
              />
                  )}
            label="미설정"
            labelPlacement="start"
          />
        </Grid>

      </Grid>
    </Dialog>
  );
}
