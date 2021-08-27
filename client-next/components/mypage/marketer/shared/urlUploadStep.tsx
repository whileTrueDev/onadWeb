import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, TextField, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import landingUrlRegex from '../../../../utils/inputs/regex/landing-url.regex';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  fields: { padding: theme.spacing(2, 0) },
  textField: { margin: theme.spacing(1, 0) },
}));

const UrlUploadStep = (props: any): JSX.Element => {
  const classes = useStyles();
  const { mainUrlName, mainUrl } = props;
  return (
    <Grid container direction="column" spacing={3} className={classes.root}>
      <Alert severity="info" icon={false}>
        <Typography variant="body2">
          * 시청자가 채팅광고 또는 패널 클릭시 접속될 웹페이지를 작성해주세요.
        </Typography>
        <Typography variant="body2">
          * URL 이름은 시청자에게 보여지는 부분이므로 신중히 작성해주세요.
        </Typography>
      </Alert>

      <div className={classes.fields}>
        <TextField
          fullWidth
          label="URL 이름"
          id="main-url-name"
          required
          variant="outlined"
          value={mainUrlName.value}
          className={classes.textField}
          onChange={mainUrlName.handleChange}
          inputProps={{ maxLength: 20 }}
          error={mainUrlName.value.length > 20}
          helperText="(최대 20자)"
        />
        <TextField
          fullWidth
          id="main-url"
          label="URL 주소"
          required
          variant="outlined"
          value={mainUrl.value}
          className={classes.textField}
          inputProps={{ minLength: 8 }}
          onChange={mainUrl.handleChange}
          error={!landingUrlRegex.test(mainUrl.value)}
          helperText="클릭시 이동될 주소"
        />
      </div>
    </Grid>
  );
};
export default UrlUploadStep;
