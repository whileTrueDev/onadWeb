/* eslint-disable react/display-name */
import { Box, Typography } from '@material-ui/core';
import { GridColumns } from '@material-ui/data-grid';
import * as React from 'react';
import { useMemo } from 'react';
import { useMarketerPaymentMethods } from '../../utils/hooks/query/useMarketerPaymentMethods';
import { SettlementByOrderData } from '../../utils/hooks/query/useMarketerSettlementLogsByOrder';
import CustomDataGridExportable from './customDataGridExportable';

interface SalesIncomeSettlementLogByOrderTableProps {
  exportFileName: string;
  isLoading: boolean;
  settlementLogsData: SettlementByOrderData[];
}

export default function SalesIncomeSettlementLogByOrderTable({
  exportFileName,
  isLoading,
  settlementLogsData,
}: SalesIncomeSettlementLogByOrderTableProps): React.ReactElement {
  const paymentMethods = useMarketerPaymentMethods();

  const column: GridColumns = [
    { field: 'orderId', headerName: '주문번호', width: 100 },
    { field: 'isLiveCommerce', headerName: '캠페인유형' },
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

  const preprocessedData = useMemo(() => {
    if (!settlementLogsData) return [];
    return settlementLogsData.map(d => ({
      ...d,
      isLiveCommerce: d.isLiveCommerce ? '라이브커머스' : '판매형광고',
    }));
  }, [settlementLogsData]);
  return (
    <Box>
      <Box height={400}>
        <CustomDataGridExportable
          exportFileName={exportFileName}
          disableSelectionOnClick
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          columns={column}
          loading={isLoading}
          rows={preprocessedData}
        />
      </Box>

      {!paymentMethods.isLoading && paymentMethods.data && (
        <Box>
          <Typography variant="body2">결제수단별 수수료</Typography>
          {paymentMethods.data.map(paymentMethod => (
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
