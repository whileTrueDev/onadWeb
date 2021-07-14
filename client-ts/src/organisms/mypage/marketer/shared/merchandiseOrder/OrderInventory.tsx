/* eslint-disable react/display-name */
import { makeStyles, Tooltip, Typography } from '@material-ui/core';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { useState } from 'react';
import * as React from 'react';
import { useQueryClient } from 'react-query';
import OrderStatusChip from '../../../../../atoms/Chip/OrderStatusChip';
// import CustomDataGrid from '../../../../../../atoms/Table/CustomDataGrid';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import { useDialog } from '../../../../../utils/hooks';
import { OrderStatus } from '../../../../../utils/render_funcs/renderOrderStatus';
import CampaignDetailDialog from '../CampaignDetailDialog';
import MerchandiseOrderDialog from './MerchandiseOrderDialog';
import {
  MerchandiseOrder,
  useMarketerMerchandisesOrders,
} from '../../../../../utils/hooks/query/useMarketerMerchandisesOrders';

const useStyles = makeStyles(theme => ({
  bold: { fontWeight: theme.typography.fontWeightBold },
  clickable: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  title: { padding: theme.spacing(1) },
}));

export interface OrderInventoryProps {
  by?: 'marketer' | 'merchandise' | 'campaign';
  merchandiseId?: number;
  campaignId?: string;
  height?: number;
  withoutTitle?: boolean;
}
export default function OrderInventory({
  by = 'marketer',
  merchandiseId,
  campaignId,
  height = 400,
  withoutTitle,
}: OrderInventoryProps): React.ReactElement {
  const classes = useStyles();
  const queryClient = useQueryClient();

  // eslint-disable-next-line max-len
  const ordersGet = useMarketerMerchandisesOrders({
    merchandiseId: by === 'merchandise' ? merchandiseId : undefined,
    campaignId: by === 'campaign' ? campaignId : undefined,
  });

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
          loading={ordersGet.isLoading}
          rows={ordersGet.data || []}
          columns={[
            { headerName: '주문번호', field: 'id', width: 120 },
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
              ),
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
              ),
            },
            {
              headerName: '주문상태',
              field: 'status',
              width: 130,
              renderCell: (data): React.ReactElement => (
                <OrderStatusChip status={data.row.status as OrderStatus} />
              ),
            },
            { headerName: '수량', field: 'quantity', width: 130 },
            {
              headerName: '주문금액',
              field: 'orderPrice',
              width: 130,
              renderCell: (data): React.ReactElement => (
                <Typography variant="body2">{data.row.orderPrice.toLocaleString()}</Typography>
              ),
            },
            {
              headerName: '상품판매금액',
              field: 'price',
              width: 130,
              renderCell: (data): React.ReactElement => {
                if (data.row.additionalPrice) {
                  return (
                    <Tooltip
                      title={`${data.row.price.toLocaleString()} (+${data.row.additionalPrice.toLocaleString()})`}
                    >
                      <Typography variant="body2">
                        {`${data.row.price.toLocaleString()}`}
                        <Typography variant="body2" component="span">
                          {`(+${data.row.additionalPrice.toLocaleString()})`}
                        </Typography>
                      </Typography>
                    </Tooltip>
                  );
                }
                return <Typography variant="body2">{data.row.price.toLocaleString()}</Typography>;
              },
            },
            // {
            //   headerName: '남은재고',
            //   field: 'stock',
            //   width: 130,
            //   renderCell: (data): React.ReactElement => (
            //     <Typography variant="body2">
            //       {data.row.stock - (data.row.merchandiseSoldCount || 0).toLocaleString()}
            //     </Typography>
            //   )
            // },
            {
              headerName: '주문일시',
              field: 'createDate',
              width: 180,
              renderCell: (data): React.ReactElement => (
                <Typography variant="body2">
                  {dayjs(data.row.createDate).format('YYYY/MM/DD HH:mm:ss')}
                </Typography>
              ),
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
            queryClient.invalidateQueries('marketerMerchandisesOrders');
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
