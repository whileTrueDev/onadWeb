import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
// core ../../../atoms
import GridContainer from '../../atoms/Grid/GridContainer';
import Card from '../../atoms/Card/Card';
import CardHeader from '../../atoms/Card/CardHeader';
import CardBody from '../../atoms/Card/CardBody';
import GridItem from '../../atoms/Grid/GridItem';
import CircularProgress from '../../atoms/Progress/CircularProgress';

import LandingSetting from '../../organisms/creator/LandingManage/LandingSetting';
import LandingImageUploadForm from '../../organisms/creator/LandingManage/LandingImageUploadForm';
import LandingUrl from '../../organisms/creator/LandingManage/LandingUrl';
import LandingCard from '../../organisms/creator/LandingManage/LandingCard';

import dashboardStyle from '../../assets/jss/onad/views/dashboardStyle';
import useFetchData from '../../utils/lib/hooks/useFetchData';

function LandingManage(props) {
  const { classes } = props;
  const landingData = useFetchData('/api/dashboard/creator/landing');
  return (
    <div>

      <GridContainer>
        {/* 랜딩페이지 URL 보기 */}
        <GridItem xs={12} xl={8}>
          <Card style={{ marginBottom: 0 }}>
            <CardBody>
              <LandingUrl userData={landingData} />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={6} md={6} xl={3}>
          <GridContainer>

            {/* 레벨 및 게이지바 */}
            <GridItem xs={12}>
              <Card>
                <CardHeader color="blueGray" stats>
                  <h4 className={classes.cardTitleWhite}>
                    설정
                  </h4>
                </CardHeader>
                <CardBody>
                  {landingData.loading && (<CircularProgress small />)}
                  {!landingData.loading && landingData.payload && (
                    <LandingSetting userData={landingData} />
                  )}
                </CardBody>
              </Card>
            </GridItem>

            <GridItem xs={12}>

              <LandingCard />

            </GridItem>
          </GridContainer>
        </GridItem>

        <GridItem xs={12} sm={6} md={6} xl={5}>

          <GridContainer>

            {/* 배경이미지 선택 */}
            <GridItem xs={12}>
              <Card>
                <CardHeader color="blueGray" stats>
                  <h4 className={classes.cardTitleWhite}>
                    배경 이미지 업로드
                  </h4>
                </CardHeader>
                <CardBody>
                  {landingData.loading && (<CircularProgress small />)}
                  {!landingData.loading && landingData.payload && (
                  <LandingImageUploadForm userData={landingData} />
                  )}
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>

    </div>
  );
}
export default withStyles(dashboardStyle)(LandingManage);

LandingManage.propTypes = {
  classes: PropTypes.object.isRequired
};
