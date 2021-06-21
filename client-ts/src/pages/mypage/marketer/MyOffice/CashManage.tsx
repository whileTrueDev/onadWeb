import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
import { AdInterface } from '../../../../organisms/mypage/marketer/dashboard/interfaces';
import CashUsageList, {
  UsageInterface,
} from '../../../../organisms/mypage/marketer/office/cash/CashUsageList';
import MyCash from '../../../../organisms/mypage/marketer/office/cash/MyCash';
import {
  AccountInterface,
  CashInterface,
} from '../../../../organisms/mypage/marketer/office/interface';
import RefundAccountForm from '../../../../organisms/mypage/marketer/office/refund/RefundAccountManage';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import useMypageScrollToTop from '../../../../utils/hooks/useMypageScrollToTop';

const useStyles = makeStyles(theme => ({
  container: { margin: '0 auto', maxWidth: 1430 },
  title: { marginTop: theme.spacing(2), color: theme.palette.text.primary },
}));
export default function MyOfficeCashManage(): JSX.Element {
  const classes = useStyles();
  // 계좌 정보
  const accountData = useGetRequest<null, AccountInterface | null>('/marketer/account');
  const cashData = useGetRequest<null, CashInterface | null>('/marketer/cash');
  const adData = useGetRequest<null, AdInterface | null>('/marketer/ad');
  const usageData = useGetRequest<null, UsageInterface | null>('/marketer/cash/history/usage');

  useMypageScrollToTop();
  return (
    <div className={classes.container}>
      {(accountData.loading || cashData.loading || adData.loading) && <CircularProgress />}

      {/* 계정 관리 */}
      {!accountData.loading && !cashData.loading && !adData.loading && (
        <div>
          <GridContainer>
            <GridItem xs={12}>
              <Typography className={classes.title} variant="h6">
                캐시 관리
              </Typography>
            </GridItem>
            {/* 캐시 정보 */}
            <GridItem xs={12} lg={6}>
              <MyCash accountData={accountData} cashData={cashData} adData={adData} />
            </GridItem>
            {/* 캐시 사용 내역 */}
            <GridItem xs={12} lg={6}>
              <CashUsageList usageData={usageData} />
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem xs={12}>
              <Typography className={classes.title} variant="h6">
                환불 관리
              </Typography>
            </GridItem>
            {/* 환불 계좌 정보 */}
            <GridItem xs={12} lg={6}>
              <RefundAccountForm accountData={accountData} />
            </GridItem>
          </GridContainer>
        </div>
      )}
    </div>
  );
}
