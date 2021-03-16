import {
  Chip, makeStyles, Tooltip, Typography
} from '@material-ui/core';
import React, { useState } from 'react';
import CustomDataGrid from '../../../../../../atoms/Table/CustomDataGrid';
// import CustomDataGrid from '../../../../../../atoms/Table/CustomDataGrid';
import { useDialog, useGetRequest } from '../../../../../../utils/hooks';
import renderOrderStatus from '../../../../../../utils/render_funcs/renderOrderStatus';
import { CampaignInterface } from '../../../dashboard/interfaces';
import { MerchandiseOrder } from '../../interface';
import MerchandiseOrderDialog from './MerchandiseOrderDialog';

const useStyles = makeStyles((theme) => ({
  bold: { fontWeight: theme.typography.fontWeightBold },
  clickable: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    }
  }
}));


export interface OrderManageTabContentsProps {
  campaign: CampaignInterface;
}
export default function OrderManageTabContents({
  campaign
}: OrderManageTabContentsProps): React.ReactElement {
  const classes = useStyles();

  const ordersGet = useGetRequest<{merchandiseId?: number}, MerchandiseOrder[]>(
    '/marketer/orders', { merchandiseId: campaign.merchandiseId }
  );

  const orderDetailDialog = useDialog();
  const [selectedMerchandise, setSelectedMerchandise] = useState<MerchandiseOrder>();
  function handleMerchandiseSelect(merOrder: MerchandiseOrder): void {
    setSelectedMerchandise(merOrder);
  }
  function handleMerchandiseSelectReset(): void {
    setSelectedMerchandise(undefined);
  }

  return (
    <>
      <Typography className={classes.bold}>주문 목록</Typography>
      <div style={{ height: 400 }}>
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
              headerName: '주문상태',
              field: 'status',
              width: 130,
              renderCell: (data): React.ReactElement => (
                <Chip label={renderOrderStatus(data.row.status)} />
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
        onStatusChange={() => {
          ordersGet.doGetRequest();
          orderDetailDialog.handleClose();
        }}
        onStatusChangeFail={() => orderDetailDialog.handleClose()}
      />
      )}
    </>
  );
}
