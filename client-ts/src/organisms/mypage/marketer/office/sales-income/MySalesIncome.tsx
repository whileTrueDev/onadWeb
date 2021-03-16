import { Link } from 'react-router-dom';
import {
  Button, makeStyles, Paper, Typography
} from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import CircularProgress from '../../../../../atoms/Progress/CircularProgress';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import { MarketerSalesImcome } from '../interface';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  },
  button: { margin: theme.spacing(0, 1, 0, 0) },
}));

export interface MySalesIncomeProps {
  salesIncomeData: UseGetRequestObject<MarketerSalesImcome>;
}
export default function MySalesIncome({
  salesIncomeData
}: MySalesIncomeProps): JSX.Element {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>

      {salesIncomeData.loading && (<CircularProgress />)}
      {!salesIncomeData.loading && !salesIncomeData.error && !salesIncomeData.data && (
        <div>
          <Typography variant="body2">아직 판매대금이 없습니다.</Typography>
          <Typography variant="body2">판매형 광고를 진행하고, 판매대금을 확보한 뒤, 출금하세요.</Typography>
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
        <div>
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
    </Paper>
  );
}
