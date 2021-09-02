import { makeStyles, Typography } from '@material-ui/core';
import GridContainer from '../../../../atoms/grid/gridContainer';
import GridItem from '../../../../atoms/grid/gridItem';
import CashUsageList from '../../../../components/mypage/marketer/myoffice/cash/cashUsageList';
import MyCash from '../../../../components/mypage/marketer/myoffice/cash/myCash';
import RefundAccountForm from '../../../../components/mypage/marketer/myoffice/refund/refundAccountManage';
import DashboardLayout from '../../../../components/mypage/layouts/marketerDashboardLayout';

const useStyles = makeStyles(theme => ({
  container: { margin: '0 auto', maxWidth: 1430 },
  title: { marginTop: theme.spacing(2), color: theme.palette.text.primary },
}));
export default function MyOfficeCashManage(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <GridContainer>
        <GridItem xs={12}>
          <Typography className={classes.title} variant="h6">
            캐시 관리
          </Typography>
        </GridItem>
        {/* 캐시 정보 */}
        <GridItem xs={12} lg={6}>
          <MyCash />
        </GridItem>
        {/* 캐시 사용 내역 */}
        <GridItem xs={12} lg={6}>
          <CashUsageList />
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
          <RefundAccountForm />
        </GridItem>
      </GridContainer>
    </div>
  );
}

MyOfficeCashManage.layout = DashboardLayout;
