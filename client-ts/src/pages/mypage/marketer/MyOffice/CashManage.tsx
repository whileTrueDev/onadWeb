import { makeStyles, Typography } from '@material-ui/core';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import CashUsageList from '../../../../organisms/mypage/marketer/office/cash/CashUsageList';
import MyCash from '../../../../organisms/mypage/marketer/office/cash/MyCash';
import RefundAccountForm from '../../../../organisms/mypage/marketer/office/refund/RefundAccountManage';
import useMypageScrollToTop from '../../../../utils/hooks/useMypageScrollToTop';

const useStyles = makeStyles(theme => ({
  container: { margin: '0 auto', maxWidth: 1430 },
  title: { marginTop: theme.spacing(2), color: theme.palette.text.primary },
}));
export default function MyOfficeCashManage(): JSX.Element {
  const classes = useStyles();

  useMypageScrollToTop();
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
