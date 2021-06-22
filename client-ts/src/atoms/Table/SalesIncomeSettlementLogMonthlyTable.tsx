import { Box, Typography } from '@material-ui/core';
import { GridColumns } from '@material-ui/data-grid';
import React from 'react';
import { SalesIncomeSettlement } from '../../organisms/mypage/marketer/office/sales-income/MySalesIncome';
import { UseGetRequestObject } from '../../utils/hooks/useGetRequest';
import CustomDataGrid from './CustomDataGrid';

interface SalesIncomeSettlementLogMonthlyTableProps {
  settlementLogsData: UseGetRequestObject<SalesIncomeSettlement[]>;
}

export default function SalesIncomeSettlementLogMonthlyTable({
  settlementLogsData,
}: SalesIncomeSettlementLogMonthlyTableProps): React.ReactElement {
  const column: GridColumns = [
    { field: 'doneDate', headerName: '년월' },
    { field: 'amount', headerName: '정산대상액' },
    { field: 'commissionAmount', headerName: '일반수수료' },
    { field: 'VAT', headerName: '부가세' },
    { field: 'amountDeliveryFee', headerName: '배송비' },
    { field: 'paymentCommissionAmount', headerName: '전자결제수단별 수수료' },
    { field: 'actualSendedAmount', headerName: '실지급액' },
  ].map(x => ({ ...x, editable: false, filterable: false, sortable: false, width: 150 }));

  return (
    <>
      <Box height={400}>
        <CustomDataGrid
          loading={settlementLogsData.loading}
          disableSelectionOnClick
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableMultipleColumnsSorting
          columns={column}
          rows={settlementLogsData.data || []}
        />
      </Box>
    </>
  );
}
