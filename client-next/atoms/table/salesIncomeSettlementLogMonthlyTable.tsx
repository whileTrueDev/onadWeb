/* eslint-disable react/display-name */
import { Box } from '@material-ui/core';
import Link from 'next/link';
import { GridColumns } from '@material-ui/data-grid';
import * as React from 'react';
import { useRouter } from 'next/router';
import { SalesIncomeSettlement } from '../../utils/hooks/query/useMarketerSettlement';
import CustomDataGridExportable from './customDataGridExportable';

interface SalesIncomeSettlementLogMonthlyTableProps {
  exportFileName: string;
  isLoading: boolean;
  settlementLogsData: SalesIncomeSettlement[];
}

export default function SalesIncomeSettlementLogMonthlyTable({
  exportFileName,
  isLoading,
  settlementLogsData,
}: SalesIncomeSettlementLogMonthlyTableProps): React.ReactElement {
  const router = useRouter();
  const column: GridColumns = [
    {
      field: 'doneDate',
      headerName: '년월',
      renderCell: (data: any): React.ReactElement => {
        const [year, month] = data.row.doneDate.split('-');
        const round = data.row.roundInMonth;
        return (
          <Link
            href={{
              pathname: router.pathname,
              query: {
                settlementLogId: data.row.id,
                year,
                month,
                roundInMonth: round,
              },
            }}
          >
            <a>{data.row.doneDate}</a>
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
          loading={isLoading}
          disableSelectionOnClick
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          columns={column}
          rows={settlementLogsData || []}
        />
      </Box>
    </>
  );
}
