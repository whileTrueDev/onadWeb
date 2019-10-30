import React from 'react';
import PropTypes from 'prop-types';
// material ui core
import { makeStyles } from '@material-ui/core/styles';

import {
  Grid
} from '@material-ui/core';
import StyledItemText from '../../../../atoms/StyledItemText';
import axios from '../../../../utils/axios';
import HOST from '../../../../utils/config';
// customized component
import Button from '../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../atoms/Dialog/Dialog';
import history from '../../../../history';


const useStyles = makeStyles(theme => ({
  dialog: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  dialogContent: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

function BanCheckDialog(props) {
  const classes = useStyles();
  const {
    open, handleClose, campaign
  } = props;

  const handleSubmit = () => {
    axios.post(`${HOST}/api/dashboard/creator/banner/delete`, { campaignId: campaign.campaignId })
      .then((res) => {
        if (res.data[0]) {
          alert('요청이 완료되었습니다.');
        } else {
          alert(res.data[1]);
        }
        history.push('/dashboard/creator/banner');
      })
      .catch(() => {
        alert('배너 삭제에 실패하였습니다 잠시후 시도해주세요.');
        history.push('/dashboard/creator/banner');
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="이 배너 광고 그만하기"
      maxWidth="sm"
      fullWidth
      buttons={(
        <div>
          <Button
            color="info"
            onClick={handleSubmit}
          >
              진행
          </Button>
          <Button onClick={handleClose}>
              취소
          </Button>

        </div>
      )}
    >
      <div className={classes.dialog}>
        <Grid container>
          {/* 출금가능금액 */}
          <Grid item>
            <div className={classes.flex}>
              <img src={campaign.bannerSrc} alt="banner" style={{ maxHeight: '200px', width: '100%' }} />
            </div>
          </Grid>
          <Grid item className={classes.dialogContent}>
            <StyledItemText primary="해당 광고의 송출을 중단하시겠어요?" secondary="지금까지의 광고료는 정산되며, 더이상 이 배너가 송출되지 않습니다." />
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
}

BanCheckDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  campaign: PropTypes.object.isRequired
};

export default BanCheckDialog;
