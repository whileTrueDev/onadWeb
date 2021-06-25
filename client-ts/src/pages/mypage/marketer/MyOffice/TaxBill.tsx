import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
import BusinessRegistration from '../../../../organisms/mypage/marketer/office/business/BusinessUploadForm';
import { BusinessInterface } from '../../../../organisms/mypage/marketer/office/interface';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import useMypageScrollToTop from '../../../../utils/hooks/useMypageScrollToTop';

const useStyles = makeStyles(theme => ({
  container: { margin: '0 auto', maxWidth: 1430 },
  title: { marginTop: theme.spacing(2), color: theme.palette.text.primary },
}));
export default function MyOfficeTaxBill(): JSX.Element {
  const classes = useStyles();
  // 계좌 정보
  const businessRegistrationData =
    useGetRequest<null, BusinessInterface | null>('/marketer/business');
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
