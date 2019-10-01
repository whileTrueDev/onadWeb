import React, { useEffect, useState, useCallback } from 'react';
// for Link tag component
// @material-ui/core
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Warning from '@material-ui/icons/Warning';
import axios from '../../../../../utils/axios';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import GridItem from '../../../components/Grid/GridItem';
import CustomButton from '../../../components/CustomButtons/Button';
import BannerListTable from '../../../components/Table/MarketerBannerListTable';
import DeleteDialog from './DeleteDialog';
// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import DangerTypography from '../../../components/Typography/Danger';
import UploadDialog from './UploadDialog';
import HOST from '../../../../../config';
import history from '../../../../../history';

const CustomTable = (props) => {
  const {
    BannerList, handleDeleteOpen, bannerId, classes
  } = props;
  return (
    <GridContainer>
      <BannerListTable
        tableHead={['캠페인', '배너 이미지', '심의결과', '기타']}
        tableData={BannerList}
        handleDeleteOpen={handleDeleteOpen}
        pagination
        buttonSet
        bannerId={bannerId}
      />
    </GridContainer>
  );
};

const BannerManage = (props) => {
  const { classes } = props;
  const [BannerList, setBannerList] = useState([]);
  const [doUpload, setUpload] = useState(false);
  const [deleteDialogOpenWithBannerId, setDeleteOpen] = useState(false);
  const [bannerIdData, setbannerIdData] = useState({});

  const handleDeleteOpen = (bannerId) => {
    setDeleteOpen(bannerId);
  };

  const handleUploadOpen = () => {
    setUpload(true);
  };

  const handleUploadClose = () => {
    setUpload(false);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleDelete = (bannerId) => {
    axios.post(`${HOST}/api/dashboard/marketer/banner/delete`, { bannerId })
      .then((res) => {
        if (res.data[0]) {
          handleDeleteClose();
          history.push(window.location.pathname);
        } else {
          console.log('에러가 떴습니다');
        }
      });
  };

  const readyBanner = useCallback(() => {
    axios.get(`${HOST}/api/dashboard/marketer/banner/all`)
      .then((res) => {
        if (res.data) {
          res.data.data.map((banner) => {
            if (banner[2] === 0) {
              banner[2] = '심의 진행중';
            } else if (banner[2] === 1) {
              banner[2] = '승인 - 광고 대기 중';
            } else if (banner[2] === 2) {
              banner[2] = '승인 거절';
            } else if (banner[2] === 3) {
              banner[2] = '승인 - 광고 진행 중';
            }
            return null;
          });
          setbannerIdData(res.data.bannerData);
          setBannerList(res.data.data);
        }
      });
  }, []);

  useEffect(() => {
    readyBanner();
  }, [readyBanner]);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={10}>
        <Card>
          <CardHeader color="blueGray" stats>
            <h4 className={classes.cardTitleWhite}>배너 리스트</h4>
            <p className={classes.cardCategoryWhite}>등록된 모든 배너를 보여줍니다.</p>
          </CardHeader>
          <CardBody>
            <CustomButton round color="info" size="lg" onClick={handleUploadOpen}>
          + 새 배너 만들기
            </CustomButton>
            {BannerList.length === 0
              ? (
                <DangerTypography>
                  <Warning />
                  {'등록된 배너가 없어요! 새 배너 만들기를 통해 등록해보세요.'}
                </DangerTypography>
              )
              : (
                <CustomTable
                  BannerList={BannerList}
                  className={classes.dangerText}
                  handleDeleteOpen={handleDeleteOpen}
                  bannerId={bannerIdData}
                />
              )
          }
          </CardBody>
        </Card>
      </GridItem>
      <UploadDialog open={doUpload} handleOpen={handleUploadClose} readyBanner={readyBanner} />
      <DeleteDialog
        open={Boolean(deleteDialogOpenWithBannerId)}
        handleOpen={handleDeleteClose}
        readyBanner={readyBanner}
        deleteFunc={handleDelete}
        bannerId={deleteDialogOpenWithBannerId}
      />
    </GridContainer>

  );
};

export default withStyles(dashboardStyle)(BannerManage);
