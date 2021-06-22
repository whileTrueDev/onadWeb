import { Box, Button, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import SalesIncomeSettlementLogByOrderTable, {
  SettlementByOrderData,
} from '../../../../../../atoms/Table/SalesIncomeSettlementLogByOrderTable';
import useGetRequest from '../../../../../../utils/hooks/useGetRequest';
import { FilterValue } from '../SalesIncomeSettlementLog';

export default function SettlementByOrder(): React.ReactElement {
  const [filterValue, setFilterValue] = React.useState<FilterValue>({
    month: null,
    year: null,
  });
  const handleFilterValueChange = (key: keyof FilterValue) => (
    e: any,
    newValue: string | null,
  ): void => {
    setFilterValue({ ...filterValue, [key]: newValue });
  };

  // 판매대금 정산 내역 - Year
  const settlementLogsYears = useGetRequest<null, string[]>('/marketer/settlement/logs/years');
  // 판매대금 정산 내역 - Month
  const settlementLogsMonths = useGetRequest<null, string[]>('/marketer/settlement/logs/months');

  // 판매대금 정산 진행 내역 조회
  const settlementLogsData = useGetRequest<FilterValue, SettlementByOrderData[]>(
    '/marketer/settlement/logs',
    {},
    { lateFetch: true },
  );
  return (
    <Box marginTop={2}>
      <Box marginBottom={1}>
        <Typography style={{ fontWeight: 'bold' }}>주문별 판매 대금 정산 처리 목록</Typography>
      </Box>

      <Box display="flex" alignItems="center">
        <Autocomplete
          options={settlementLogsYears.data || []}
          loading={settlementLogsYears.loading}
          loadingText="로딩중.."
          getOptionLabel={option => option}
          value={filterValue.year}
          onChange={handleFilterValueChange('year')}
          renderInput={params => (
            <TextField
              {...params}
              margin="dense"
              variant="outlined"
              label="년도"
              style={{ width: 200 }}
            />
          )}
        />
        <Autocomplete
          options={settlementLogsMonths.data || []}
          loading={settlementLogsMonths.loading}
          loadingText="로딩중.."
          getOptionLabel={option => option}
          value={filterValue.month}
          onChange={handleFilterValueChange('month')}
          renderInput={params => (
            <Box ml={1}>
              <TextField
                {...params}
                margin="dense"
                variant="outlined"
                label="월"
                style={{ width: 200 }}
              />
            </Box>
          )}
        />
      </Box>

      <Box marginY={1}>
        <Button
          variant="contained"
          color="primary"
          disabled={!filterValue.year || !filterValue.month}
          onClick={() => {
            settlementLogsData.doGetRequest({
              month: filterValue.month,
              year: filterValue.year,
            });
          }}
        >
          보기
        </Button>
      </Box>
      {!settlementLogsData.loading && !settlementLogsData.error && settlementLogsData.data && (
        <SalesIncomeSettlementLogByOrderTable settlementLogsData={settlementLogsData} />
      )}
    </Box>
  );
}
