import React from 'react';
import {
  Grid, Typography, Divider, DialogTitle, Chip, Avatar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import shortid from 'shortid';
import StyledItemText from '../../../atoms/StyledItemText';
import DescPopover from '../../../atoms/DescPopover';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '600px'
  },
  area: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  head: {
    fontWeight: '700',
    color: theme.palette.info.main,
  },
  titleRoot: {
    margin: 0,
    // padding: theme.spacing(2),
    backgroundColor: '#00acc1',
    color: '#FFF',
  },
  title: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '13px',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.15rem',
      fontWeight: '700'
    },
  },
  text: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  padding: {
    paddingBottom: theme.spacing(3),
  }
}));

const BannerDescPopover = (props) => {
  const classes = useStyles();
  const {
    currentBannerData, open, anchorEl, handlePopoverClose, descIndex
  } = props;

  return (
    <DescPopover
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      open={open}
      anchorEl={anchorEl}
      handlePopoverClose={handlePopoverClose}
      descIndex={descIndex}
      styleProps={{ padding: 0 }}
    >

      <Grid container direction="column" spacing={4} className={classes.root}>
        <Grid item>
          <DialogTitle disableTypography className={classes.titleRoot}>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item>
                <Typography className={classes.title}>배너 상세 정보</Typography>
              </Grid>
            </Grid>
          </DialogTitle>
        </Grid>
        <Grid item className={classes.text}>
          <Grid container direction="column" spacing={4} className={classes.padding}>
            <Grid item>
              <Typography style={{ fontSize: '16px', color: '#00acc1', fontWeight: '700' }}>
                광고주
              </Typography>
            </Grid>
            <Grid container direction="row">
              <Grid item md={1} />
              <Grid item>
                <Typography variant="body1" style={{ fontWeight: '700' }}>
                  {currentBannerData.payload && currentBannerData.payload[descIndex].marketerName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider component="hr" variant="middle" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.text}>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography style={{ fontSize: '16px', color: '#00acc1', fontWeight: '700' }}>
                배너소개
              </Typography>
            </Grid>
            <Grid container direction="row">
              <Grid item md={1} />
              <Grid container direction="column" className={classes.text}>
                {currentBannerData.payload && currentBannerData.payload[descIndex].bannerDescription.split('\n').map((row) => (
                  <Grid item key={shortid.generate()}>
                    <Typography variant="body2">
                      {row}
                    </Typography>
                  </Grid>
                ))}
                <Divider component="hr" variant="middle" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.text}>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <StyledItemText primary="카테고리" secondary="해당 배너의 카테고리입니다." fontSize="16px" color="#00acc1" />
            </Grid>
            <Grid container direction="row">
              <Grid item md={1} />
              <Grid container direction="row" className={classes.text} spacing={1}>
                <Grid item>
                  <Chip variant="outlined" size="large" label="또제" avatar={<Avatar><span role="img" aria-label="또제">❤️</span></Avatar>} />
                </Grid>
                <Grid item>
                  <Chip variant="outlined" size="large" label="성인" avatar={<Avatar><span role="img" aria-label="성인">✂️</span></Avatar>} />
                </Grid>
                {/* {currentBannerData.payload
                  && currentBannerData.payload[descIndex].bannerDescription.split('\n').map(row => (
                    <Grid item key={shortid.generate()}>
                      <Typography variant="body2">
                        {row}
                      </Typography>
                    </Grid>
                  ))} */}
                <Grid item xs={12}>
                  <Divider component="hr" variant="middle" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.text}>
          <Grid container direction="row-reverse">
            <Typography variant="caption" style={{ color: 'rgba(0, 0, 0, 0.54)' }}>클릭시 해당 창이 사라집니다.</Typography>
          </Grid>
        </Grid>
      </Grid>
    </DescPopover>
  );
};

export default BannerDescPopover;
