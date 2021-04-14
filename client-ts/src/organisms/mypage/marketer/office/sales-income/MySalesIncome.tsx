import { Link } from 'react-router-dom';
import {
  Button, Chip, makeStyles, Paper, Typography
} from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import CircularProgress from '../../../../../atoms/Progress/CircularProgress';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import MarketerSettlementLogsTable from '../../../../../atoms/Table/MarketerSettlementLogsTable';
import { MarketerSalesImcome, MarketerSettlement } from '../interface';
import { useDialog } from '../../../../../utils/hooks';
import SettlementRegDialog from '../../shared/settlement/SettlementRegDialog';
import renderMarketerSettlementState, { 광고주_정산등록상태_승인 } from '../../../../../utils/render_funcs/renderMarketerSettlementState';
import SettlementViewer from '../../shared/settlement/SettlementViewer';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  },
  button: { margin: theme.spacing(0, 1, 0, 0) },
  bottomSpace: { marginBottom: theme.spacing(1) },
  topSpace: { marginTop: theme.spacing(2) },
}));

export type SalesIncomeSettlement = Array<string>
export interface MySalesIncomeProps {
  salesIncomeData: UseGetRequestObject<MarketerSalesImcome>;
  settlementData: UseGetRequestObject<MarketerSettlement>;
  salesIncomeSettlementData: UseGetRequestObject<SalesIncomeSettlement[]>;
}
export default function MySalesIncome({
  salesIncomeData,
  settlementData,
  salesIncomeSettlementData,
}: MySalesIncomeProps): JSX.Element {
  const classes = useStyles();

  const settlementDialog = useDialog();

  return (
    <Paper className={classes.root}>

      {salesIncomeData.loading && (<CircularProgress />)}
      {!salesIncomeData.loading && !salesIncomeData.error && !salesIncomeData.data && (
        <div className={classes.bottomSpace}>
          <div className={classes.bottomSpace}>
            <Typography variant="body2">아직 판매대금이 없습니다.</Typography>
            <Typography variant="body2">판매형 광고를 진행하고, 판매대금을 확보한 뒤, 출금하세요.</Typography>
          </div>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.button}
            to="/mypage/marketer/campaigncreate"
            component={Link}
          >
            캠페인 생성하러 가기
          </Button>
        </div>
      )}
      {!salesIncomeData.loading && salesIncomeData.data && (
        <div className={classes.bottomSpace}>
          <Typography style={{ fontWeight: 'bold' }}>보유 판매 대금</Typography>
          <Typography gutterBottom variant="h4" style={{ fontWeight: 'bold' }}>
            {`${salesIncomeData.data.receivable.toLocaleString()} 원`}
            <Typography component="span" variant="body2" color="textSecondary">
              &nbsp;
              {`누적 판매 대금: ${salesIncomeData.data.totalIncome.toLocaleString()} 원`}
            </Typography>
          </Typography>
          {!salesIncomeData.loading && !salesIncomeData.error && salesIncomeData.data && (
          <Typography variant="caption" color="textSecondary">
            {`최근 판매 대금 변동: ${moment(salesIncomeData.data.createDate).fromNow()}`}
          </Typography>
          )}
        </div>
      )}
      {!settlementData.loading && (
      <div className={classes.bottomSpace}>
        <Typography>
          {'정산등록상태: '}
          {!settlementData.data
            ? (<Chip label="미등록" size="small" />)
            : (
              <Chip
                label={renderMarketerSettlementState(settlementData.data.state)}
                size="small"
                color={settlementData.data.state === 광고주_정산등록상태_승인 ? 'primary' : 'default'}
              />
            )}
        </Typography>
      </div>
      )}

      <div>
        <Button
          className={classes.button}
          size="small"
          variant="outlined"
          color="primary"
          onClick={settlementDialog.handleOpen}
        >
          {settlementData.data ? '계좌 및 정산정보 수정' : '계좌 및 정산 등록'}
        </Button>
      </div>

      {settlementData.data && (
        <SettlementViewer settlement={settlementData.data} />
      )}

      {!salesIncomeSettlementData.loading && !salesIncomeSettlementData.error
      && salesIncomeSettlementData.data && (
        <div className={classes.topSpace}>
          <Typography style={{ fontWeight: 'bold' }}>판매 대금 정산 처리 목록</Typography>

          <MarketerSettlementLogsTable
            tableHead={['날짜', '금액']}
            tableData={salesIncomeSettlementData.data}
          />
        </div>
      )}

      <SettlementRegDialog
        open={settlementDialog.open}
        onClose={settlementDialog.handleClose}
        settlementData={settlementData}
      />

    </Paper>
  );
}
