import classnames from 'classnames';
import {
  Chip, makeStyles, Tooltip, Typography
} from '@material-ui/core';
import React, { useContext, useState } from 'react';
// import CustomDataGrid from '../../../../../../atoms/Table/CustomDataGrid';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import MarketerInfoContext from '../../../../../context/MarketerInfo.context';
import { useDialog, useGetRequest } from '../../../../../utils/hooks';
import { MerchandiseOrder } from '../../adManage/interface';
import MerchandiseOrderDialog from './MerchandiseOrderDialog';
import CampaignDetailDialog from '../CampaignDetailDialog';

const useStyles = makeStyles((theme) => ({
  bold: { fontWeight: theme.typography.fontWeightBold },
  clickable: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    }
  },
  title: { padding: theme.spacing(1) }
}));


export interface OrderInventoryProps {
  by?: 'marketer' | 'merchandise';
  merchandiseId?: number;
  campaignId?: number;
  height?: number;
  withoutTitle?: boolean;
}
export default function OrderInventory({
  by = 'marketer',
  merchandiseId,
  height = 400,
  withoutTitle,
}: OrderInventoryProps): React.ReactElement {
  const auth = useContext(MarketerInfoContext);
  const classes = useStyles();

  // eslint-disable-next-line max-len
  const ordersGet = useGetRequest<{ marketerId?: string; merchandiseId?: number }, MerchandiseOrder[]>(
    '/marketer/orders', {
      marketerId: by === 'marketer' ? auth.user?.marketerId : undefined,
      merchandiseId: by === 'merchandise' ? merchandiseId : undefined,
    }
  );

  const orderDetailDialog = useDialog();
  const [selectedMerchandise, setSelectedMerchandise] = useState<MerchandiseOrder>();
  function handleMerchandiseSelect(merOrder: MerchandiseOrder): void {
    setSelectedMerchandise(merOrder);
  }
  function handleMerchandiseSelectReset(): void {
    setSelectedMerchandise(undefined);
  }

  const campaignDetailDialog = useDialog();
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  function handleCampaignSelect(_campaignId: string): void {
    setSelectedCampaignId(_campaignId);
  }
  function handleCampaignSelectReset(): void {
    setSelectedCampaignId('');
  }

  return (
    <>
      {withoutTitle ? null : (
        <Typography className={classnames(classes.title, classes.bold)}>주문 목록</Typography>
      )}
      <div style={{ height }}>
        <CustomDataGrid
          loading={ordersGet.loading}
          rows={ordersGet.data || []}
          columns={[
            { headerName: '주문번호', field: 'id', width: 120, },
            {
              headerName: '상품명',
              field: 'name',
              width: 130,
              renderCell: (data): React.ReactElement => (
                <Tooltip title={data.row.name}>
                  <Typography
                    variant="body2"
                    className={classes.clickable}
                    onClick={(): void => {
                      orderDetailDialog.handleOpen();
                      handleMerchandiseSelect(data.row as MerchandiseOrder);
                    }}
                  >
                    {data.row.name}
                  </Typography>
                </Tooltip>
              )
            },
            {
              headerName: '캠페인',
              field: 'campaignId',
              width: 130,
              renderCell: (data): React.ReactElement => (
                <Tooltip title={data.row.campaignId}>
                  <Typography
                    variant="body2"
                    className={classes.clickable}
                    onClick={(): void => {
                      handleCampaignSelect(data.row.campaignId as string);
                      campaignDetailDialog.handleOpen();
                    }}
                  >
                    {data.row.campaignId}
                  </Typography>
                </Tooltip>
              )
            },
            {
              headerName: '주문상태',
              field: 'status',
              width: 130,
              renderCell: (data): React.ReactElement => (
                <Chip label={data.row.statusString} />
              )
            },
            { headerName: '수량', field: 'quantity', width: 130, },
            {
              headerName: '남은재고',
              field: 'stock',
              width: 130,
              renderCell: (data): React.ReactElement => (
                <Typography variant="body2">
                  {data.row.stock - (data.row.merchandiseSoldCount || 0).toLocaleString()}
                </Typography>
              )
            },
            {
              headerName: '주문금액',
              field: 'orderPrice',
              width: 130,
              renderCell: (data): React.ReactElement => (
                <Typography variant="body2">{data.row.orderPrice.toLocaleString()}</Typography>
              )
            },
            {
              headerName: '상품금액',
              field: 'price',
              width: 130,
              renderCell: (data): React.ReactElement => (
                <Typography variant="body2">{data.row.price.toLocaleString()}</Typography>
              )
            },
          ]}
        />
      </div>

      {selectedMerchandise && (
      <MerchandiseOrderDialog
        open={orderDetailDialog.open}
        onClose={(): void => {
          orderDetailDialog.handleClose();
          handleMerchandiseSelectReset();
        }}
        merchandiseOrder={selectedMerchandise}
        onStatusChange={(): void => {
          ordersGet.doGetRequest();
          orderDetailDialog.handleClose();
        }}
        onStatusChangeFail={(): void => orderDetailDialog.handleClose()}
      />
      )}

      {selectedCampaignId && (
        <CampaignDetailDialog
          campaignId={selectedCampaignId}
          open={campaignDetailDialog.open}
          onClose={(): void => {
            campaignDetailDialog.handleClose();
            handleCampaignSelectReset();
          }}
        />
      )}
    </>
  );
}
