import React from 'react';
import {
  Grid, Typography, Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import shortid from 'shortid';
import StyledItemText from '../../components/NewCreates/StyledItemText';
import DescPopover from '../../components/NewCreates/DescPopover';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: '550px'
  },
  area: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  head: {
    fontWeight: '700',
    color: '#455a64',
  },
  divider: {
    marginRight: theme.spacing(4)
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
    >
      <Grid container direction="column" spacing={4} className={classes.root}>
        <Grid item>
          <Grid container direction="column" spacing={5}>
            <Grid item>
              <StyledItemText primary="광고주" secondary="해당 광고의 광고주입니다." fontSize="16px" />
            </Grid>
            <Grid container direction="row-reverse">
              <Grid item md={1} />
              <Grid item>
                <Typography variant="body1" style={{ fontWeight: '700' }}>
                  {currentBannerData.payload && currentBannerData.payload[descIndex].marketerName}
                </Typography>
                <Divider component="hr" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <StyledItemText primary="회사 소개" secondary="해당 광고의 광고주에 대한 설명입니다." fontSize="16px" />
            </Grid>
            <Grid container direction="row">
              <Grid item md={1} />
              <Grid item md={11}>
                <Grid container direction="column">
                  {currentBannerData.payload && currentBannerData.payload[descIndex].companyDescription.split('\n').map(row => (
                    <Grid item key={shortid.generate()}>
                      <Typography variant="body2">
                        {row}
                      </Typography>
                    </Grid>
                  ))}
                  <Divider component="hr" className={classes.divider} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <StyledItemText primary="배너 소개" secondary="해당 배너에 대한 소개입니다." fontSize="16px" />
            </Grid>
            <Grid container direction="row">
              <Grid item md={1} />
              <Grid item md={11}>
                <Grid container direction="column">
                  {currentBannerData.payload && currentBannerData.payload[descIndex].bannerDescription.split('\n').map(row => (
                    <Grid item key={shortid.generate()}>
                      <Typography variant="body2">
                        {row}
                      </Typography>
                    </Grid>
                  ))}
                  <Divider component="hr" className={classes.divider} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item />
        <Grid item>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <StyledItemText primary="카테고리" secondary="해당 배너의 카테고리입니다." fontSize="16px" />
            </Grid>
            <Grid container direction="row">
              <Grid item md={1} />
              <Grid item md={11}>
                <Grid container direction="column">
                  {/* {currentBannerData.payload && currentBannerData.payload[descIndex].bannerDescription.split('\n').map(row => (
                    <Grid item key={shortid.generate()}>
                      <Typography variant="body2">
                        {row}
                      </Typography>
                    </Grid>
                  ))} */}
                  <Divider component="hr" className={classes.divider} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row-reverse">
            <Typography variant="caption" style={{ color: 'rgba(0, 0, 0, 0.54)' }}>클릭시 해당 창이 사라집니다.</Typography>
          </Grid>
        </Grid>
      </Grid>
    </DescPopover>
  );
};

export default BannerDescPopover;
