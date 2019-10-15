import React, { useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '../../../atoms/Card/Card';
import CardHeader from '../../../atoms/Card/CardHeader';
import CardBody from '../../../atoms/Card/CardBody';
import BannerTable from './sub/BannerTable';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import CircularProgress from '../../../atoms/Progress/CircularProgress';

const dummyData = [
  {
    marketerName: '박찬우',
    date: '2019-10-10 18:30:00',
    bannerSrc: '$$',
    cash: '3000',
    cpc: '1500',
    cpm: '1500',
    bannerDesc: `안녕하세요. 1인 미디어 광고 매칭 파트너 OnAD입니다.
    저희는 크리에이터의 편의성과 광고주의 만족을 최우선으로 하고 있습니다.`,
    companyDesc: 'Gstar관련 광고입니다.',
    state: 1
  }
];


const BannerTableCard = (props) => {
  const { classes } = props;
  const tableData = useFetchData('/api/dashboard/creator/banner/list');
  return (
    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.cardTitleWhite}>캠페인 내역</h4>
      </CardHeader>
      <CardBody>
        {tableData.loading && (<CircularProgress small />)}
        {!tableData.loading && !tableData.error && (
          <BannerTable tableData={tableData.payload} />
        )}
      </CardBody>
    </Card>
  );
};

export default withStyles(dashboardStyle)(BannerTableCard);
