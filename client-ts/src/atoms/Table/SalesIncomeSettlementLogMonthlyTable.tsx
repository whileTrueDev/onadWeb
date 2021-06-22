/* eslint-disable react/display-name */
import { Box, Link } from '@material-ui/core';
import { GridColumns } from '@material-ui/data-grid';
import React from 'react';
import { Link as ReactRouterLink, useHistory } from 'react-router-dom';
import { SalesIncomeSettlement } from '../../organisms/mypage/marketer/office/sales-income/MySalesIncome';
import { UseGetRequestObject } from '../../utils/hooks/useGetRequest';
import CustomDataGridExportable from './CustomDataGridExportable';

interface SalesIncomeSettlementLogMonthlyTableProps {
  exportFileName: string;
  settlementLogsData: UseGetRequestObject<SalesIncomeSettlement[]>;
}

export default function SalesIncomeSettlementLogMonthlyTable({
  exportFileName,
  settlementLogsData,
}: SalesIncomeSettlementLogMonthlyTableProps): React.ReactElement {
  const history = useHistory();

  const column: GridColumns = [
    {
      field: 'doneDate',
      headerName: '년월',
      renderCell: (data: any): React.ReactElement => {
        const [year, month] = data.row.doneDate.split('-');
        const round = data.row.roundInMonth;
        return (
          <Link
            component={ReactRouterLink}
            to={`${history.location.pathname}?settlementLogId=${data.row.id}&year=${year}&month=${month}&roundInMonth=${round}`}
            variant="body2"
          >
            {data.row.doneDate}
          </Link>
        );
      },
      width: 100,
    },
    { field: 'roundInMonth', headerName: '회차', width: 80 },
    { field: 'amount', headerName: '정산대상액' },
    { field: 'commissionAmount', headerName: '일반수수료' },
    { field: 'VAT', headerName: '부가세' },
    { field: 'amountDeliveryFee', headerName: '배송비' },
    { field: 'paymentCommissionAmount', headerName: '전자결제수단별 수수료' },
    { field: 'actualSendedAmount', headerName: '실지급액' },
  ].map(x => ({
    ...x,
    editable: false,
    filterable: false,
    sortable: false,
    width: x.width || 150,
  }));

  return (
    <>
      <Box height={400}>
        <CustomDataGridExportable
          exportFileName={exportFileName}
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
