import {
  CircularProgress, Divider, Grid, Hidden, makeStyles, Paper, Popover, Typography, useTheme
} from '@material-ui/core';
import { Help } from '@material-ui/icons';
import React from 'react';
import {
  Cell, Legend, Pie, PieChart, Tooltip
} from 'recharts';
import { useAnchorEl, useGetRequest } from '../../../../utils/hooks';

const useStyles = makeStyles((theme) => ({
  container: {
    height: 200,
    padding: 32,
    marginBottom: 16,
    [theme.breakpoints.down('xs')]: {
      minHeight: 420
    }
  },
  divider: {
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    }
  },
  loading: {
    display: 'flex', justifyContent: 'center', height: 200, alignItems: 'center'
  },
  fields: { textAlign: 'center' }
}));

export interface IncomeRatio {
  creatorId: string; type: 'CPM' | 'CPC' | 'CPA'; cashAmount: number;
}
export default function AdIncomeCard(): JSX.Element {
  const incomeRatioGet = useGetRequest<null, IncomeRatio[]>('/creator/income/ratio');
  const theme = useTheme();
  const classes = useStyles();

  // *********************************************
  // chart settings
  const COLORS = [
    theme.palette.primary.light,
    theme.palette.secondary.light,
    theme.palette.success.light
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
  }: any): JSX.Element => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // 차트 범례 표시 컴포넌트
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div>
        {
          payload.map((entry: any) => (
            <div key={`item-${entry.value}`}>
              <div style={{ width: 8, height: 8, backgroundColor: entry.color }} />
              <Typography variant="body2">{entry.value}</Typography>
            </div>
          ))
        }
      </div>
    );
  };

  // 수익 type 렌더링 함수
  const renderType = (type: 'CPM' | 'CPC' | 'CPA'): string => {
    if (type === 'CPM') return '배너광고';
    if (type === 'CPC') return '클릭/채팅광고';
    if (type === 'CPA') return '참여형광고';
    return '';
  };

  // 참여형 광고 설명 팝오버
  const descAnchor = useAnchorEl();

  return (
    <Paper className={classes.container}>
      <Grid container justify="space-around">
        {/* 로딩중 */}
        {incomeRatioGet.loading && (
          <Grid item className={classes.loading}>
            <CircularProgress />
          </Grid>
        )}

        {/* 수익데이터가없는 경우 */}
        {!incomeRatioGet.loading && incomeRatioGet.data && incomeRatioGet.data.length === 0 && (
          <Grid
            item
            style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Typography variant="body1" style={{ fontWeight: 'bold', }}>표시할 수익 데이터가 아직 없습니다.</Typography>
            </div>
          </Grid>
        )}

        {!incomeRatioGet.loading && incomeRatioGet.data && incomeRatioGet.data.length > 0 && (
          <>
            <Grid item xs={12} sm={6}>
              <Typography style={{ fontWeight: 'bold', marginBottom: 16 }}>광고 수익 정보</Typography>
              {incomeRatioGet.data.sort((a, b) => b.type.localeCompare(a.type)).map((d) => (
                <div key={d.type + d.cashAmount} className={classes.fields}>
                  <Typography>
                    {renderType(d.type)}

                    {/* CPA의 경우 설명 (?) 아이콘 생성 */}
                    {d.type === 'CPA' && (
                    <Typography
                      aria-owns={descAnchor.open ? 'mouse-over-popover' : undefined}
                      component="span"
                      aria-haspopup="true"
                      style={{ cursor: 'pointer' }}
                      onClick={descAnchor.handleAnchorOpen}
                    >
                      <Help fontSize="small" />
                    </Typography>
                    )}

                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    {`${d.cashAmount.toLocaleString()} 원`}
                  </Typography>
                </div>
              ))}
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* 모바일화면 DIvider */}
              <Hidden smUp><Divider className={classes.divider} /></Hidden>
              <Typography style={{ fontWeight: 'bold' }}>광고 수익 비율</Typography>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart width={270} height={200}>
                  <Pie
                    data={incomeRatioGet.data.map((d) => ({
                      cashAmount: d.cashAmount, type: renderType(d.type)
                    }))}
                    dataKey="cashAmount"
                    nameKey="type"
                    cx={90}
                    cy={90}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={70}
                  >
                    {incomeRatioGet.data.map((entry, index) => <Cell key={`cell-${entry.type}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Legend layout="vertical" align="right" verticalAlign="middle" content={renderLegend} />
                  <Tooltip />
                </PieChart>
              </div>
            </Grid>
          </>
        )}
      </Grid>

      <Popover
        disableScrollLock
        id="mouse-over-popover"
        open={descAnchor.open}
        anchorEl={descAnchor.anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={descAnchor.handleAnchorClose}
        disableRestoreFocus
      >
        <div style={{ padding: 32, maxWidth: 300, textAlign: 'center' }}>
          <Typography variant="body2">
            참여형 광고는 시청자의 참여(제품설치/구매 등)가 수익으로 이어지는 광고상품입니다.
          </Typography>
          <Typography variant="caption">
            2020년 11월 3일 이후 해당 상품 서비스 종료되었습니다.
          </Typography>

        </div>
      </Popover>

    </Paper>
  );
}
