import React from 'react';
import {
  Grid, Divider, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import BannerCarousel from '../../../atoms/BannerCarousel';
import Button from '../../../atoms/CustomButtons/Button';
import Success from '../../../atoms/Success';
import StyledItemText from '../../../atoms/StyledItemText';
import StyledInput from '../../../atoms/StyledInput';
import axios from '../../../utils/axios';
import HOST from '../../../utils/config';
import DangerTypography from '../../../atoms/Typography/Danger';
// 배너 등록
import history from '../../../history';

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

const CampaignCreate = (props) => {
  const classes = useStyles();
  const { bannerList, dispatch } = props;
  // 이름의  format을 체크하는 State
  const [checkName, setCheckName] = React.useState(false);
  const [duplicate, setDuplicate] = React.useState(false);

  const checkCampaignName = (value) => {
    axios.post(`${HOST}/api/dashboard/marketer/campaign/checkName`, { campaignName: value })
      .then((res) => {
      // 올바른 데이터가 전달되었다.
        if (res.data) {
          setCheckName(false);
          dispatch({ key: 'campaignName', value: '' });
          setDuplicate(true);
        } else {
          setCheckName(true);
          dispatch({ key: 'campaignName', value });
          setDuplicate(false);
        }
      });
  };

  const handleChangeName = (event) => {
    if (event.target.value.length === 0) {
      setDuplicate(false);
    }
    if (event.target.value.length >= 3) {
      checkCampaignName(event.target.value);
    } else {
      setCheckName(false);
      dispatch({ key: 'campaignName', value: '' });
    }
  };

  const handleBannerId = (bannerId) => {
    dispatch({ key: 'bannerId', value: bannerId });
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Grid container direction="column" className={classes.item} spacing={1}>
          <Grid item>
            <StyledItemText primary="첫째,&nbsp;&nbsp; 캠페인 이름 입력하기" secondary="해당 광고 캠페인의 이름을 입력하세요." className={classes.label} />
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item>
                <StyledInput autoFocus className={classes.input} onChange={handleChangeName} />
              </Grid>
              <Grid item>
                {checkName
                && (
                <Success>
                  <Check />
                </Success>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <DangerTypography>
              {duplicate
              && ('캠페인명이 중복되었습니다.')
              }
            </DangerTypography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="column" className={classes.item} spacing={1}>
          <Grid item>
            <StyledItemText primary="둘째,&nbsp;&nbsp; 배너 선택하기" secondary="해당 광고 캠페인에 사용할 배너를 선택해주세요." className={classes.label} />
            <Divider component="hr" style={{ marginBottom: '10px', width: '300px' }} />
          </Grid>
          <Grid item>
            {bannerList.length > 0 ? (
              <BannerCarousel steps={bannerList} handleBannerId={handleBannerId} />
            ) : (
              <div>
                <Typography variant="body1">아직 승인된 배너가 없어요! 먼저 배너를 등록한 이후, 캠페인을 생성해주세요!</Typography>
                <Button
                  color="info"
                  onClick={() => { history.push('/dashboard/marketer/banner'); }}
                >
                  배너등록하러 가기
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>

  );
};

export default CampaignCreate;
