import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid, Link, Typography, Divider, ListItem, ListItemText, List, Paper, Hidden,
} from '@material-ui/core';
import Dialog from '../../../components/Dialog/Dialog';

const formStyle = theme => ({
  imgPreview: {
    width: '100%',
    height: 'auto',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '200px',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '600px',
      maxHeight: '300px',
    },
  },
  input: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#3c4858',
    marginLeft: '10px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      margin: 0,
    },
  },
  label: {
    color: '#455a64',
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
  container: {
    padding: '2px',
  },
  url: {
    fontSize: '15px',
    fontWeight: '700',
    marginLeft: '10px',
  },
  item: {
    marginBottom: '10px',
  },
});

const BannerDescDialog = (props) => {
  const {
    classes, open, handleClose, descData,
  } = props;

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      disableBackdropClick
      title="배너 상세정보"
    >
      <Grid container direction="column" spacing={3}>
        <Grid item className={classes.container}>
          <img id="preview" src={descData.bannerSrc} className={classes.imgPreview} alt="이미지가 보일 영역" />
        </Grid>
        <Grid item>
          <List>
            <ListItem className={classes.item}>
              <Grid container direction="column" spacing={1}>
                <Paper style={{ padding: '15px' }}>
                  <Grid item>
                    <Hidden smDown>
                      <ListItemText primary="회사소개" secondary="광고주의 간략한 회사소개입니다." className={classes.label} />
                    </Hidden>
                    <Hidden mdUp>
                      <Typography className={classes.label}>회사소개</Typography>
                    </Hidden>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.input}>{descData.companyDescription}</Typography>
                  </Grid>
                  <Divider variant="middle" component="hr" style={{ marginBottom: '5px' }} />
                </Paper>
              </Grid>
            </ListItem>
            <ListItem className={classes.item}>
              <Grid container direction="column" spacing={1}>
                <Paper style={{ padding: '15px' }}>
                  <Grid item>
                    <Hidden smDown>
                      <ListItemText primary="배너소개" secondary="배너에 대한 간략한 설명입니다." className={classes.label} />
                    </Hidden>
                    <Hidden mdUp>
                      <Typography className={classes.label}>배너소개</Typography>
                    </Hidden>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.input}>{descData.bannerDescription}</Typography>
                  </Grid>
                  <Divider variant="middle" component="hr" style={{ marginBottom: '5px' }} />
                </Paper>
              </Grid>
            </ListItem>
            <ListItem className={classes.item}>
              <Grid container direction="column" spacing={1}>
                <Paper style={{ padding: '15px' }}>
                  <Grid item>
                    <Hidden smDown>
                      <ListItemText primary="URL" secondary="랜딩이미지에 연결될 구매페이지 입니다." className={classes.label} />
                    </Hidden>
                    <Hidden mdUp>
                      <Typography className={classes.label}>URL</Typography>
                    </Hidden>
                  </Grid>
                  <Grid item>
                    <Link href={descData.landingUrl} className={classes.url} target="_blank" rel="noopener">{descData.landingUrl}</Link>
                  </Grid>
                  <Divider variant="middle" component="hr" style={{ marginBottom: '5px' }} />
                </Paper>
              </Grid>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Dialog>
  );
};

BannerDescDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  descData: PropTypes.object.isRequired,
};

export default withStyles(formStyle)(BannerDescDialog);
