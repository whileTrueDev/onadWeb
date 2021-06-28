import { Box, Button, TextField, Typography, CircularProgress, Grid } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useEffect, useMemo } from 'react';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import SalesIncomeSettlementLogByOrderTable, {
  PaymentMethods,
  SettlementByOrderData,
} from '../../../../../../atoms/Table/SalesIncomeSettlementLogByOrderTable';
import useGetRequest from '../../../../../../utils/hooks/useGetRequest';
import parseParams from '../../../../../../utils/parseParams';
import { FilterValue } from '../SalesIncomeSettlementLog';

export default function SettlementByOrder(): React.ReactElement {
  // 판매대금 정산 내역 - Year
  const settlementLogsYears = useGetRequest<null, string[]>('/marketer/settlement/logs/years');
  // 판매대금 정산 내역 - Month
  const settlementLogsMonths = useGetRequest<null, string[]>(
    '/marketer/settlement/logs/months',
    null,
    { lateFetch: true },
  );
  // 판매대금 정산 내역 - round
  const settlementLogsRounds = useGetRequest<null, string[]>(
    '/marketer/settlement/logs/rounds',
    null,
    { lateFetch: true },
  );

  // 판매대금 정산 진행 내역 조회
  const settlementLogsData = useGetRequest<FilterValue, SettlementByOrderData[]>(
    '/marketer/settlement/logs',
    {},
    { lateFetch: true },
  );

  // 판매 결제수단별 수수료 정보 조회
  const paymentMethodData = useGetRequest<null, PaymentMethods[]>(
    '/marketer/merchandises/payment-methods',
    null,
    { lateFetch: true },
  );

  const [filterValue, setFilterValue] = React.useState<FilterValue>({
    month: null,
    year: null,
    roundInMonth: null,
  });
  const handleFilterValueChange =
    (key: keyof FilterValue) =>
    (e: React.ChangeEvent<{}>, newValue: string | null): void => {
      setFilterValue({ ...filterValue, [key]: newValue });
    };

  const location = useLocation();
  const params = useMemo(() => parseParams(location.search), [location.search]);
  useEffect(() => {
    if (params.settlementLogId) {
      settlementLogsData.doGetRequest({ settlementLogId: params.settlementLogId });
      paymentMethodData.doGetRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.settlementLogId]);

  // * 내보내기 파일 명
  const exportFileName = useMemo(() => {
    if (params && params.year && params.month && params.roundInMonth) {
      const { year, month, roundInMonth } = params;
      return `온애드_판매대금_정산_내역_${year}년_${month}월_${roundInMonth}회차`;
    }
    const { year, month, roundInMonth } = filterValue;
    return `온애드_판매대금_정산_내역_${year}년_${month}월_${roundInMonth}회차`;
  }, [filterValue, params]);

  return (
    <Box marginTop={2}>
      <Box marginBottom={1}>
        <Typography style={{ fontWeight: 'bold' }}>주문별 판매 대금 정산 처리 목록</Typography>
      </Box>

      <Grid container>
        <Box mr={1}>
          <Autocomplete
            options={settlementLogsYears.data || []}
            loading={settlementLogsYears.loading}
            loadingText="로딩중.."
            noOptionsText="아직 정산 내역이 없습니다."
            getOptionLabel={(option): string => option}
            value={filterValue.year}
            onChange={(e, v) => {
              handleFilterValueChange('year')(e, v);
              settlementLogsMonths.doGetRequest({ year: v });
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
        </Box>
        <Box mr={1}>
          {!filterValue.year ? null : (
            <>
              {settlementLogsMonths.loading ? (
                <CircularProgress />
              ) : (
                <Autocomplete
                  options={settlementLogsMonths.data || []}
                  loading={settlementLogsMonths.loading}
                  loadingText="로딩중.."
                  getOptionLabel={(option): string => option}
                  value={filterValue.month}
                  onChange={(e, v) => {
                    handleFilterValueChange('month')(e, v);
                    settlementLogsRounds.doGetRequest({
                      year: filterValue.year,
                      month: v,
                    });
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
              {settlementLogsRounds.loading ? (
                <CircularProgress />
              ) : (
                <Autocomplete
                  options={settlementLogsRounds.data || []}
                  loading={settlementLogsRounds.loading}
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

      {!settlementLogsYears.loading && settlementLogsYears.data?.length === 0 && (
        <Box>
          <Typography variant="body2">아직 정산 내역이 없습니다.</Typography>
        </Box>
      )}

      {/* 보기 버튼 */}
      <Box marginY={1}>
        <Button
          variant="contained"
          color="primary"
          disabled={!filterValue.year || !filterValue.month || !filterValue.roundInMonth}
          onClick={(): void => {
            settlementLogsData.doGetRequest({
              month: filterValue.month,
              year: filterValue.year,
              roundInMonth: filterValue.roundInMonth,
            });
            paymentMethodData.doGetRequest();
          }}
        >
          보기
        </Button>
      </Box>

      {/* 월별 -> 특정 월 선택한 경우 */}
      {params.settlementLogId &&
      params.year &&
      params.month &&
      params.roundInMonth &&
      !settlementLogsMonths.data &&
      !settlementLogsRounds.data ? (
        <Box>
          <Typography>{`${params.year}-${params.month} ${params.roundInMonth}회차`}</Typography>
        </Box>
      ) : null}

      {settlementLogsData.loading && <CircularProgress />}
      {!settlementLogsData.loading && !settlementLogsData.error && settlementLogsData.data && (
        <SalesIncomeSettlementLogByOrderTable
          exportFileName={exportFileName}
          settlementLogsData={settlementLogsData}
          paymentMethodData={paymentMethodData}
        />
      )}
    </Box>
  );
}
