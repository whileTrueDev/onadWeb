import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography, Tooltip, Grid } from '@material-ui/core';
import CustomButton from '../../../atoms/CustomButtons/Button';
import StyledItemText from '../../../atoms/StyledItemText';
import Dialog from '../../../atoms/Dialog/Dialog';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import useDeleteData from '../../../utils/lib/hooks/useDeleteData';
import history from '../../../history';

const useStyles = makeStyles(theme => ({
  img: {
    maxHeight: '200px',
    // maxWidth: 540
    maxWidth: '100%'
  },
  reasonText: {
    marginLeft: theme.spacing(2),
    color: 'red'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const DeleteDialog = (props) => {
  const classes = useStyles();
  const {
    open, selectedUrl, handleClose
  } = props;
  const deleteRequest = useDeleteData('/api/dashboard/marketer/inventory/landingurl');
  const connectedCampaign = useFetchData(
    '/api/dashboard/marketer/inventory/landingurl/connectedcampaign', {
      linkId: selectedUrl.linkId
    }
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="해당 URL를 삭제하시겠습니까?"
      fullWidth
      maxWidth="sm"
      buttons={(
        <div style={{ display: 'flex' }}>
          {!connectedCampaign.loading && connectedCampaign.payload.length > 0 && (
            <Tooltip title={<Typography>URL이 캠페인에 할당되어 있어 삭제가 불가능합니다.</Typography>}>
              <div>
                <CustomButton
                  color="primary"
                  disabled
                >
                  확인
                </CustomButton>
              </div>
            </Tooltip>
          )}
          {!connectedCampaign.loading && connectedCampaign.payload.length === 0 && (
            <CustomButton
              color="primary"
              onClick={() => {
                deleteRequest.handleDelete({ linkId: selectedUrl.linkId });
                setTimeout(() => {
                  handleClose();
                  history.push(window.location.pathname);
                }, 1000);
              }}
            >
              확인
            </CustomButton>
          )}
          <CustomButton onClick={handleClose}>취소</CustomButton>
        </div>
      )}
    >
      <Grid container direction="column" spacing={2}>
        {selectedUrl.links.links.map(url => (
          <Grid item className={classes.center}>
            <Typography
              style={{
                color: 'red', cursor: 'pointer', textDecoration: 'underline'
              }}
              onClick={(e) => {
                e.preventDefault();
                window.open(url.linkTo);
              }}
            >
              {url && url.linkName ? url.linkName : url.linkTo }
            </Typography>
          </Grid>
        ))}
        {selectedUrl.bannerDenialReason && (
        <Grid item>
          <div>
            <StyledItemText primary="거절 사유:" fontSize="18px" />
            <Typography variant="body1" className={classes.reasonText}>{selectedUrl.denialReason}</Typography>
          </div>
        </Grid>
        )}
        <Grid item>
          <Typography variant="body2" className={classes.typo}>
            <span role="img" aria-label="warning">⚠️</span>
            {' '}
            URL이 캠페인에 할당되어 있는 경우 삭제가 불가능합니다. 캠페인을 먼저 정리하신 후 삭제해주세요.
          </Typography>
          <Typography variant="body2">
            <span role="img" aria-label="calling">📞</span>
            {' '}
            URL 등록 및 삭제 관련 도움은 support@onad.io 로 메일을 보내주시거나, onad 카카오톡 채널에서 상담가능합니다.
          </Typography>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default DeleteDialog;

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  selectedUrl: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  handleClose: PropTypes.func.isRequired,
};
