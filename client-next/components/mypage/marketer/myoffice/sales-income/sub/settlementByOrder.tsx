import { Box, CircularProgress, Grid, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import * as React from 'react';
import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import SalesIncomeSettlementLogByOrderTable from '../../../../../../atoms/table/salesIncomeSettlementLogByOrderTable';
import { useMarketerSettlementLogMonths } from '../../../../../../utils/hooks/query/useMarketerSettlementLogMonths';
import { useMarketerSettlementLogRounds } from '../../../../../../utils/hooks/query/useMarketerSettlementLogRounds';
import { useMarketerSettlementLogsByOrder } from '../../../../../../utils/hooks/query/useMarketerSettlementLogsByOrder';
import { useMarketerSettlementLogYears } from '../../../../../../utils/hooks/query/useMarketerSettlementLogYears';
import { FilterValue } from '../salesIncomeSettlementLog';

type queryType = {
  year: string | null;
  month: string | null;
  roundInMonth: string | null;
};

export default function SettlementByOrder(): React.ReactElement {
  const [filterValue, setFilterValue] = React.useState<FilterValue>({
    year: null,
    month: null,
    roundInMonth: null,
  });
  const handleFilterValueChange =
    (key: keyof FilterValue) =>
    // eslint-disable-next-line @typescript-eslint/ban-types
    (e: React.ChangeEvent<{}>, newValue: string | null): void => {
      setFilterValue({ ...filterValue, [key]: newValue });
    };

  // 판매대금 정산 내역 - Year
  const settlementLogsYears = useMarketerSettlementLogYears();
  // 판매대금 정산 내역 - Month
  const settlementLogsMonths = useMarketerSettlementLogMonths(filterValue.year);
  // 판매대금 정산 내역 - round
  const settlementLogsRounds = useMarketerSettlementLogRounds({
    year: filterValue.year,
    month: filterValue.month,
  });

  const router = useRouter();

  // 판매대금 정산 진행 내역 조회
  useEffect(() => {
    const { year, month, roundInMonth } = router.query as queryType;
    setFilterValue({ year, month, roundInMonth });
  }, [router.query]);
  const settlementLogs = useMarketerSettlementLogsByOrder(filterValue);

  // * 내보내기 파일 명
  const exportFileName = useMemo(() => {
    if (router.query && router.query.year && router.query.month && router.query.roundInMonth) {
      const { year, month, roundInMonth } = router.query;
      return `온애드_판매대금_정산_내역_${year}년_${month}월_${roundInMonth}회차`;
    }
    const { year, month, roundInMonth } = filterValue;
    return `온애드_판매대금_정산_내역_${year}년_${month}월_${roundInMonth}회차`;
  }, [filterValue, router.query]);

  return (
    <Box marginTop={2}>
      <Box marginBottom={1}>
        <Typography style={{ fontWeight: 'bold' }}>주문별 판매 대금 정산 처리 목록</Typography>
      </Box>

      <Grid container>
        <Box mr={1}>
          {settlementLogsYears.isLoading ? (
            <CircularProgress />
          ) : (
            <Autocomplete
              options={settlementLogsYears.data || []}
              loading={settlementLogsYears.isLoading}
              loadingText="로딩중.."
              noOptionsText="아직 정산 내역이 없습니다."
              getOptionLabel={(option): string => option}
              value={filterValue.year}
              onChange={(e, v) => {
                handleFilterValueChange('year')(e, v);
              }}
              renderInput={_params => (
                <TextField
                  {..._params}
                  margin="dense"
                  variant="outlined"
                  label="년도"
                  style={{ width: 200 }}
                />
              )}
            />
          )}
        </Box>
        <Box mr={1}>
          {!filterValue.year ? null : (
            <>
              {settlementLogsMonths.isLoading ? (
                <CircularProgress />
              ) : (
                <Autocomplete
                  options={settlementLogsMonths.data || []}
                  loading={settlementLogsMonths.isLoading}
                  loadingText="로딩중.."
                  getOptionLabel={(option): string => option}
                  value={filterValue.month}
                  onChange={(e, v) => {
                    handleFilterValueChange('month')(e, v);
                  }}
                  renderInput={_params => (
                    <TextField
                      {..._params}
                      margin="dense"
                      variant="outlined"
                      label="월"
                      style={{ width: 200 }}
                    />
                  )}
                />
              )}
            </>
          )}
        </Box>

        <Box>
          {!filterValue.year || !filterValue.month ? null : (
            <>
              {settlementLogsRounds.isLoading ? (
                <CircularProgress />
              ) : (
                <Autocomplete
                  options={settlementLogsRounds.data || []}
                  loading={settlementLogsRounds.isLoading}
                  loadingText="로딩중.."
                  getOptionLabel={(option): string => option}
                  value={filterValue.roundInMonth}
                  onChange={handleFilterValueChange('roundInMonth')}
                  renderInput={_params => (
                    <TextField
                      {..._params}
                      margin="dense"
                      variant="outlined"
                      label="회차"
                      style={{ width: 200 }}
                    />
                  )}
                />
              )}
            </>
          )}
        </Box>
      </Grid>

      {!settlementLogsYears.isLoading && settlementLogsYears.data?.length === 0 && (
        <Box>
          <Typography variant="body2">아직 정산 내역이 없습니다.</Typography>
        </Box>
      )}

      {/* 월별 -> 특정 월 선택한 경우 */}
      {router.query.settlementLogId &&
      router.query.year &&
      router.query.month &&
      router.query.roundInMonth &&
      !settlementLogsMonths.data &&
      !settlementLogsRounds.data ? (
        <Box>
          <Typography>{`${router.query.year}-${router.query.month} ${router.query.roundInMonth}회차`}</Typography>
        </Box>
      ) : null}
      <Box my={2}>
        {settlementLogs.isLoading && <CircularProgress />}
        {!settlementLogs.isLoading && !settlementLogs.error && settlementLogs.data && (
          <SalesIncomeSettlementLogByOrderTable
            exportFileName={exportFileName}
            isLoading={settlementLogs.isLoading}
            settlementLogsData={settlementLogs.data}
          />
        )}
      </Box>
    </Box>
  );
}
