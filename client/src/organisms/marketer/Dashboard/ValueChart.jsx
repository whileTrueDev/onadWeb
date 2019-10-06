import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import withStyles from '@material-ui/core/styles/withStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import Typography from '@material-ui/core/Typography';
import StackedBar from '../../../atoms/Chart/StackedBar';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import Card from '../../../atoms/Card/Card';
import CardHeader from '../../../atoms/Card/CardHeader';
import CardBody from '../../../atoms/Card/CardBody';
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';

function ValueChart(props) {
  const { classes } = props;
  const valueChartData = useFetchData('/api/dashboard/marketer/campaign/chart');
  const theme = useTheme();
  const isXlWidth = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.cardTitleWhite}>광고 비용 (효과) 차트</h4>
      </CardHeader>
      <CardBody />
      <div>
        { valueChartData.loading && (<CircularProgress />)}
        { !valueChartData.loading && valueChartData.error && (
        <Typography variant="h6">데이터가 없어요! 광고를 진행하세요.</Typography>
        )}
        { !valueChartData.loading && valueChartData.payload && (
        <div>
          {isXlWidth ? (
            <StackedBar height={70} dataSet={valueChartData.payload} />
          ) : (
            <StackedBar height={150} dataSet={valueChartData.payload} />
          )}
        </div>
        )}
      </div>
    </Card>
  );
}

export default withStyles(dashboardStyle)(ValueChart);
