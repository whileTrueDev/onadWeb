import React from 'react';
import { Button, Typography, Tooltip, Grid } from '@material-ui/core';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
import useDeleteRequest from '../../../../../utils/hooks/useDeleteRequest';
import { Merchandise } from '../interface';

interface MerchandiseDeleteDialogProps {
  open: boolean;
  selectedMerchandise: Merchandise;
  handleClose: () => void;
  recallRequest: () => void;
}

const MerchandiseDeleteDialog = (props: MerchandiseDeleteDialogProps): JSX.Element => {
  const { open, selectedMerchandise, handleClose, recallRequest } = props;

  const { loading, doDeleteRequest } =
    useDeleteRequest<{ id?: number }, any[]>('/marketer/merchandises');

  const connectedCampaign = useGetRequest<{ id?: number }, number>(
    '/marketer/merchandises/campaigns',
    {
      id: selectedMerchandise.id,
    },
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="해당 상품을 삭제하시겠습니까?"
      fullWidth
      maxWidth="sm"
      buttons={
        <div style={{ display: 'flex' }}>
          {!connectedCampaign.loading && connectedCampaign.data && connectedCampaign.data > 0 ? (
            <Tooltip
              title={<Typography>상품이 캠페인에 할당되어 있어 삭제가 불가능합니다.</Typography>}
            >
              <div>
                <Button variant="outlined" color="primary" disabled style={{ marginRight: 4 }}>
                  확인
                </Button>
              </div>
            </Tooltip>
          ) : null}
          {!connectedCampaign.loading && connectedCampaign.data === 0 ? (
            <Button
              style={{ marginRight: 4 }}
              variant="outlined"
              color="primary"
              disabled={loading}
              onClick={(): void => {
                doDeleteRequest({ id: selectedMerchandise.id });
                setTimeout(() => {
                  handleClose();
                  if (recallRequest) {
                    recallRequest();
                  }
                }, 1000);
              }}
            >
              확인
            </Button>
          ) : null}
          <Button variant="outlined" onClick={handleClose}>
            취소
          </Button>
        </div>
      }
    >
      <Grid container direction="column" spacing={2}>
        <Grid item xs={12}>
          <Typography>{`상품명: ${selectedMerchandise.name}`}</Typography>
          {selectedMerchandise.description && (
            <Typography>{`상품설명: ${selectedMerchandise.description.slice(0, 100)}`}</Typography>
          )}
        </Grid>
        <Grid item>
          <Typography variant="body2">
            <span role="img" aria-label="warning">
              ⚠️
            </span>{' '}
            상품이 캠페인에 할당되어 있는 경우 삭제가 불가능합니다. 캠페인을 먼저 정리하신 후
            삭제해주세요.
          </Typography>
          <Typography variant="body2">
            <span role="img" aria-label="calling">
              📞
            </span>{' '}
            상품 등록 및 삭제 관련 도움은 support@onad.io 로 메일을 보내주시거나, onad 카카오톡
            채널에서 상담가능합니다.
          </Typography>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default MerchandiseDeleteDialog;
