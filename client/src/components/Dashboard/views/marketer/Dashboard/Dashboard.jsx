import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
// material core
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
// core ../../../components
import Add from '@material-ui/icons/Add';
import CircularProgress from '../../../components/Progress/CircularProgress';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardIcon from '../../../components/Card/CardIcon';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import Button from '../../../components/CustomButtons/Button';
import Table from './RecommendTable';
import SwitchButton from './SwitchButton';
import ValueChart from './ValueChart';

import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import axios from '../../../../../utils/axios';
import HOST from '../../../../../config';
import history from '../../../../../history';
// 상수
const WAIT_BANNER_STATE = 1; // 대기중 배너 스테이트

const useStyles = makeStyles(theme => ({

}));

const Dashboard = (props) => {
  const secondClasses = useStyles();
  const { classes } = props;
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} md={12} xl={12}>
          <Card>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '45px'
            }}
            >
              <div>
                <SwitchButton />
              </div>
              <div>
              운영 상태
              </div>
            </div>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={4}>
          <Card>
            <CardHeader color="blueGray">
              <p className={classes.cardTitleWhite}>광고 금액, 차트 제어 콘솔</p>
            </CardHeader>
            <CardBody>
            광고금액, 차트 제어 콘솔
            </CardBody>
          </Card>
        </GridItem>

        <GridItem xs={8}>
          <Card>
            <CardHeader color="blueGray">
              <p className={classes.cardTitleWhite}>광고 비용 (효과) 차트</p>
            </CardHeader>
            <CardBody>
              광고 비용 (효과) 차트
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="blueGray">
              <p className={classes.cardTitleWhite}>캠페인 내역</p>
            </CardHeader>
            <CardBody>
              <Button color="info">
                <Add />
                새 캠페인 등록하기
              </Button>
              <Table
                tableHeaderColor="info"
                tableHead={['캠페인명', '일예산', '사용금액', '클릭수', '노출수', '등록된 배너']}
                tableData={[
                  ['-', '-', '-', '-', '-', '-']
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(Dashboard);
