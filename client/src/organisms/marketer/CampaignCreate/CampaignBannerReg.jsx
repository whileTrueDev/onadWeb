import React from 'react';
import {
  Grid, Divider, Typography
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import { makeStyles } from '@material-ui/core/styles';

import StyledItemText from '../../../atoms/StyledItemText';
import Success from '../../../atoms/Success';
import DangerTypography from '../../../atoms/Typography/Danger';
import StyledInput from '../../../atoms/StyledInput';
import axios from '../../../utils/axios';
import HOST from '../../../utils/config';
import BannerCarousel from '../../../atoms/BannerCarousel';
import Button from '../../../atoms/CustomButtons/Button';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  item: {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      marginBottom: '30px',
      padding: 0,
    },
  },
  input: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
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
}));


const CampaignBannerReg = (props) => {
  const { dispatch, bannerList } = props;
  const classes = useStyles();

  const handleBannerId = (bannerId) => {
    dispatch({ key: 'bannerId', value: bannerId });
  };

  return (
    <Grid item>
      <Grid container direction="column" className={classes.item} spacing={1}>
        <Grid item>
          <StyledItemText primary="배너 선택하기" secondary="해당 광고 캠페인에 사용할 배너를 선택해주세요." className={classes.label} />
          <Divider component="hr" style={{ marginBottom: '10px', width: '300px' }} />
        </Grid>
        <Grid item>
          {bannerList.length > 0 ? (
            <BannerCarousel steps={bannerList} handleBannerId={handleBannerId} />
          ) : (
            <div>
              <Typography variant="body1">저장된 배너가 없어요! 먼저 배너를 저장한 이후, 캠페인을 생성해주세요!</Typography>
              <Button
                color="info"
                onClick={() => { window.open('/dashboard/marketer/banner'); }}
              >
                  배너등록하러 가기
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CampaignBannerReg;
