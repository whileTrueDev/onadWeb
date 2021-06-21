import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
import BusinessRegistration from '../../../../organisms/mypage/marketer/office/business/BusinessUploadForm';
import { BusinessInterface } from '../../../../organisms/mypage/marketer/office/interface';
import MySalesIncome from '../../../../organisms/mypage/marketer/office/sales-income/MySalesIncome';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import useMypageScrollToTop from '../../../../utils/hooks/useMypageScrollToTop';

const useStyles = makeStyles(theme => ({
  container: { margin: '0 auto', maxWidth: 1430 },
  title: { marginTop: theme.spacing(2), color: theme.palette.text.primary },
}));
export default function MyOfficeSettlementManage(): JSX.Element {
  const classes = useStyles();
  // 계좌 정보
  const businessRegistrationData = useGetRequest<null, BusinessInterface | null>(
    '/marketer/business',
  );
  // CPS 판매 광고 대금
  const salesIncomeData = useGetRequest('/marketer/sales-income');
  // 판매대금 출금정산을 위한 정산 등록
  const settlementData = useGetRequest('/marketer/settlement');
  // 판매대금 정산 진행 내역
  const settlementLogsData = useGetRequest('/marketer/settlement/logs');

  useMypageScrollToTop();
  return (
    <div className={classes.container}>
      {businessRegistrationData.loading && <CircularProgress />}

      {/* 계정 관리 */}
      {!businessRegistrationData.loading && (
        <div>
          <GridContainer>
            <GridItem xs={12}>
              <Typography className={classes.title} variant="h6">
                판매 대금 관리
              </Typography>
            </GridItem>
            {/* 판매 대금 정보 */}
            <GridItem xs={12} lg={6}>
              <MySalesIncome
                salesIncomeData={salesIncomeData}
                settlementData={settlementData}
                salesIncomeSettlementData={settlementLogsData}
              />
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem xs={12}>
              <Typography className={classes.title} variant="h6">
                세금계산서 관리
              </Typography>
            </GridItem>
            <GridItem xs={12} lg={6}>
              <BusinessRegistration businessRegistrationData={businessRegistrationData} />
            </GridItem>
          </GridContainer>
        </div>
      )}
    </div>
  );
}
