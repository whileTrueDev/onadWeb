import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Dialog from '../../../../atoms/Dialog/Dialog';
import Button from '../../../../atoms/CustomButtons/Button';

export default function CampaignDeleteConfirmDialog(props) {
  const { open, handleClose, handleDelete } = props;
  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      buttons={(
        <div>
          <Button
            color="primary"
            onClick={() => {
              handleDelete({ campaignId: open });
              handleClose();
            }}
          >
            삭제
          </Button>
          <Button onClick={handleClose}>
            취소
          </Button>
        </div>
      )}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1">
            해당 캠페인을 삭제하시겠습니까?
          </Typography>
        </div>
        <div>
          <Typography variant="body1">
            삭제시, 진행중이던 광고는 모두 중지됩니다.
          </Typography>
        </div>
      </div>
    </Dialog>
  );
}

CampaignDeleteConfirmDialog.propTypes = {
  open: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
};
