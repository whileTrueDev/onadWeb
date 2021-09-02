import { makeStyles, Typography } from '@material-ui/core';
import GridContainer from '../../../../atoms/grid/gridContainer';
import GridItem from '../../../../atoms/grid/gridItem';
import MySalesIncome from '../../../../components/mypage/marketer/myoffice/sales-income/mySalesIncome';
import SalesIncomeSettlementLog from '../../../../components/mypage/marketer/myoffice/sales-income/salesIncomeSettlementLog';
import DashboardLayout from '../../../../components/mypage/layouts/marketerDashboardLayout';

const useStyles = makeStyles(theme => ({
  container: { margin: '0 auto', maxWidth: 1430 },
  title: { marginTop: theme.spacing(2), color: theme.palette.text.primary },
}));
export default function SalesIncomeManage(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {/* 계정 관리 */}
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <Typography className={classes.title} variant="h6">
              판매 대금 관리
            </Typography>
          </GridItem>
          {/* 판매 대금 정보 */}
          <GridItem xs={12}>
            <MySalesIncome />
          </GridItem>

          <GridItem xs={12}>
            <SalesIncomeSettlementLog />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

SalesIncomeManage.layout = DashboardLayout;
