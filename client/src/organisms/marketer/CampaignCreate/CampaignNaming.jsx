import React from 'react';
import {
  Grid
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import { makeStyles } from '@material-ui/core/styles';

import StyledItemText from '../../../atoms/StyledItemText';
import Success from '../../../atoms/Success';
import DangerTypography from '../../../atoms/Typography/Danger';
import StyledInput from '../../../atoms/StyledInput';
import axios from '../../../utils/axios';
import HOST from '../../../utils/config';

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


const CampaignNaming = (props) => {
  const { dispatch, checkName, setCheckName } = props;
  const classes = useStyles();
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


  return (
    <Grid item>
      <Grid container direction="column" className={classes.item} spacing={1}>
        <Grid item>
          <StyledItemText primary="캠페인 이름 입력하기" secondary="해당 광고 캠페인의 이름을 입력하세요." className={classes.label} />
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
  );
};

export default CampaignNaming;
