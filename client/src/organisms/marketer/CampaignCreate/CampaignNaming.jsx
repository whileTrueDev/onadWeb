import React from 'react';
import {
  Grid
} from '@material-ui/core';
import PropTypes from 'prop-types';
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
  const {
    nameState, nameDispatch
  } = props;
  const classes = useStyles();

  const checkCampaignName = (value) => {
    axios.post(`${HOST}/api/dashboard/marketer/campaign/checkName`, { campaignName: value })
      .then((res) => {
      // 올바른 데이터가 전달되었다.
        if (res.data) {
          nameDispatch({ key: 'duplicate' });
        } else {
          nameDispatch({ key: 'set', value });
        }
      });
  };

  const getName = () => {
    const nameTag = document.getElementsByName('name')[0];
    if (nameTag) {
      if (nameTag.value === '') {
        nameDispatch({ key: 'min' });
      }
      return nameTag.value;
    }
    nameDispatch({ key: 'min' });
    return '';
  };

  const handleChangeName = () => {
    const inputName = getName();
    if (inputName.length >= 2) {
      checkCampaignName(inputName);
    }
    // else {
    //   nameDispatch({ key: 'min' });
    // }
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
              <StyledInput
                autoFocus
                name="name"
                className={classes.input}
                onChange={handleChangeName}
              />
            </Grid>
            <Grid item>
              {(!nameState.error && getName() !== '')
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
            {nameState.error && nameState.msg}
          </DangerTypography>
        </Grid>
      </Grid>
    </Grid>
  );
};

/**
 * @description
 해당 캠페인의 이름을 설정하는 컴포넌트

 * @param {*} nameDispatch ? campaignName에 대한 error와 data를 설정하는 func
 * @param {*} nameState ? campaignName에 대한 error와 data를 저장하는 object
 * @author 박찬우
 */
CampaignNaming.propTypes = {
  nameDispatch: PropTypes.func.isRequired,
  nameState: PropTypes.object.isRequired,
};


export default CampaignNaming;
