import { CircularProgress, Button, Box, Typography, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import * as React from 'react';
import SalesIncomeSettlementLogMonthlyTable from '../../../../../../atoms/Table/SalesIncomeSettlementLogMonthlyTable';
import useGetRequest from '../../../../../../utils/hooks/useGetRequest';
import { SalesIncomeSettlement } from '../MySalesIncome';
import { FilterValue } from '../SalesIncomeSettlementLog';

export default function MonthlySettlement(): React.ReactElement {
  // 월 데이터
  const [year, setYear] = React.useState<null | string>(null);
  function handleYearChange(e: React.ChangeEvent<{}>, newValue: string | null): void {
    setYear(newValue);
  }

  // 판매대금 정산 내역 - Year
  const settlementLogsYears = useGetRequest<null, string[]>('/marketer/settlement/logs/years');

  // 판매대금 정산 진행 내역 조회
  const settlementLogsData = useGetRequest<FilterValue, SalesIncomeSettlement[]>(
    '/marketer/settlement/logs',
    {},
    { lateFetch: true },
  );
  return (
    <Box marginTop={2}>
      <Box marginBottom={1}>
        <Typography style={{ fontWeight: 'bold' }}>월별 판매 대금 정산 처리 목록</Typography>
      </Box>

      <Box display="flex" alignItems="center">
        <Autocomplete
          options={settlementLogsYears.data || []}
          loading={settlementLogsYears.loading}
          loadingText="로딩중.."
          noOptionsText="아직 정산 내역이 없습니다."
          getOptionLabel={option => option}
          value={year}
          onChange={handleYearChange}
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
      </Box>
      {!settlementLogsYears.loading && settlementLogsYears.data?.length === 0 && (
        <Box>
          <Typography variant="body2">아직 정산 내역이 없습니다.</Typography>
        </Box>
      )}
      <Box marginY={1}>
        <Button
          variant="contained"
          color="primary"
          disabled={!year}
          onClick={() => {
            settlementLogsData.doGetRequest({
              month: null,
              year,
            });
          }}
        >
          보기
        </Button>
      </Box>
      {settlementLogsData.loading && <CircularProgress />}
      {!settlementLogsData.loading && !settlementLogsData.error && settlementLogsData.data && (
        <SalesIncomeSettlementLogMonthlyTable
          exportFileName={`온애드_판매대금_정산_내역_${year}년`}
          settlementLogsData={settlementLogsData}
        />
      )}
    </Box>
  );
}
