/* eslint-disable react/display-name */
import { Box, Typography } from '@material-ui/core';
import { GridColumns } from '@material-ui/data-grid';
import React from 'react';
import { UseGetRequestObject } from '../../utils/hooks/useGetRequest';
import CustomDataGridExportable from './CustomDataGridExportable';

export interface SettlementByOrderData {
  VAT: number;
  actualSendedAmount: number;
  bigo: string;
  campaignId: string;
  campaignName: string;
  commissionAmount: number;
  deliveryFee: number;
  id: number;
  orderId: number;
  orderPrice: number;
  paymentCommissionAmount: number;
  paymentMethod: string;
  purchaseChannel: string;
  settlementLogId: number;
  createDate: Date;
  orderDate: Date;
  cancelDate: Date | null;
  purchaseConfirmDate: Date;
  updateDate: Date;
}

export interface PaymentMethods {
  id: number;
  method: string;
  paymentFee: number;
  paymentFeeFixed: number;
}
interface SalesIncomeSettlementLogByOrderTableProps {
  settlementLogsData: UseGetRequestObject<SettlementByOrderData[]>;
  paymentMethodData: UseGetRequestObject<PaymentMethods[]>;
}

export default function SalesIncomeSettlementLogByOrderTable({
  settlementLogsData,
  paymentMethodData,
}: SalesIncomeSettlementLogByOrderTableProps): React.ReactElement {
  const column: GridColumns = [
    { field: 'orderId', headerName: '주문번호', width: 100 },
    {
      field: 'isLiveCommerce',
      headerName: '캠페인유형',
      renderCell: (data: any): React.ReactElement => (
        <Typography variant="body2">
          {data.row.isLiveCommerce ? '라이브커머스' : '판매형광고'}
        </Typography>
      ),
    },
    { field: 'campaignName', headerName: '캠페인명' },
    { field: 'orderPrice', headerName: '정산대상액' },
    { field: 'purchaseChannel', headerName: '구매채널' },
    { field: 'commissionAmount', headerName: '일반수수료' },
    { field: 'VAT', headerName: '부가세' },
    { field: 'deliveryFee', headerName: '배송비' },
    { field: 'paymentCommissionAmount', headerName: '전자결제수단별수수료' },
    { field: 'actualSendedAmount', headerName: '실지급액' },
    { field: 'paymentMethod', headerName: '결제방법' },
    { field: 'orderDate', headerName: '주문일자', width: 160 },
    { field: 'purchaseConfirmDate', headerName: '구매확정일자', width: 160 },
    { field: 'bigo', headerName: '비고' },
    { field: 'cancelDate', headerName: '취소일자' },
  ].map(x => ({
    ...x,
    editable: false,
    filterable: false,
    sortable: false,
    width: x.width || 150,
  }));
  return (
    <Box>
      <Box height={400}>
        <CustomDataGridExportable
          disableSelectionOnClick
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableMultipleColumnsSorting
          columns={column}
          loading={settlementLogsData.loading}
          rows={settlementLogsData.data || []}
        />
      </Box>

      {!paymentMethodData.loading && paymentMethodData.data && (
        <Box>
          <Typography variant="body2">결제수단별 수수료</Typography>
          {paymentMethodData.data.map(paymentMethod => (
            <Typography key={paymentMethod.id} variant="caption">
              {`${paymentMethod.method}: `}
              {paymentMethod.paymentFee
                ? `${paymentMethod.paymentFee}%`
                : `${paymentMethod.paymentFeeFixed}원 (고정)`}{' '}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}
