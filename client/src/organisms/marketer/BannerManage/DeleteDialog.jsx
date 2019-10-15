import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography, Tooltip } from '@material-ui/core';
import CustomButton from '../../../atoms/CustomButtons/Button';
import Dialog from '../../../atoms/Dialog/Dialog';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import useUpdateData from '../../../utils/lib/hooks/useUpdateData';
import history from '../../../history';

const useStyles = makeStyles(theme => ({
  img: {
    maxHeight: 320,
    maxWidth: 540
  },
  reasonText: {
    display: 'flex',
    marginBottom: theme.spacing(2)
  }
}));

const DeleteDialog = (props) => {
  const classes = useStyles();
  const {
    open, selectedBanner, handleClose
  } = props;
  const deleteRequest = useUpdateData('/api/dashboard/marketer/banner/delete');
  const connectedCampaign = useFetchData('/api/dashboard/marketer/banner/connectedcampaign', {
    bannerId: selectedBanner.bannerId
  });
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="해당 배너를 삭제하시겠습니까?"
      fullWidth
      maxWidth="sm"
      buttons={(
        <div style={{ display: 'flex' }}>
          {!connectedCampaign.loading && connectedCampaign.payload.length > 0 ? (
            <Tooltip title={<Typography>배너가 캠페인에 할당되어 있어 삭제가 불가능합니다.</Typography>}>
              <div>
                <CustomButton
                  color="info"
                  disabled
                >
                  {'확인'}
                </CustomButton>
              </div>
            </Tooltip>
          ) : (
            <CustomButton
              color="info"
              onClick={() => {
                deleteRequest.handleUpdateRequest({ bannerId: selectedBanner.bannerId });
                setTimeout(() => {
                  handleClose();
                  history.push(window.location.pathname);
                }, 1000);
              }}
            >
              {'확인'}
            </CustomButton>
          )}
          <CustomButton onClick={handleClose}>취소</CustomButton>
        </div>
      )}
    >
      <div style={{ padding: 10 }}>
        <img
          src={selectedBanner.bannerSrc}
          alt={selectedBanner.bannerId}
          className={classes.img}
        />
        <br />
        {selectedBanner.bannerDenialReason && (
          <div className={classes.reasonText}>
            <Typography variant="body1">거절 사유 :&emsp;</Typography>
            <Typography variant="body1">{selectedBanner.bannerDenialReason}</Typography>
          </div>
        )}
        <Typography variant="body2">- 배너가 현재 ON 상태인 캠페인에 할당되어 있는 경우 삭제가 불가능합니다.</Typography>
        <Typography variant="body2">- 배너 등록 관련 도움은 support@onad.io 로 메일을 보내주시거나, onad 카카오톡 채널에서 상담가능합니다.</Typography>
      </div>
    </Dialog>
  );
};

export default DeleteDialog;

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  selectedBanner: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  handleClose: PropTypes.func.isRequired,
};
