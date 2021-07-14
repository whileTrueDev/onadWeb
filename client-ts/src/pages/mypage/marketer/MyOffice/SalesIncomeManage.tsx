import { makeStyles, Typography } from '@material-ui/core';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import MySalesIncome from '../../../../organisms/mypage/marketer/office/sales-income/MySalesIncome';
import SalesIncomeSettlementLog from '../../../../organisms/mypage/marketer/office/sales-income/SalesIncomeSettlementLog';
import useMypageScrollToTop from '../../../../utils/hooks/useMypageScrollToTop';

const useStyles = makeStyles(theme => ({
  container: { margin: '0 auto', maxWidth: 1430 },
  title: { marginTop: theme.spacing(2), color: theme.palette.text.primary },
}));
export default function SalesIncomeManage(): JSX.Element {
  const classes = useStyles();

  useMypageScrollToTop();
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
