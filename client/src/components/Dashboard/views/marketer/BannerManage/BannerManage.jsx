import React, { useEffect, useState, useCallback } from 'react';
// for Link tag component
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Tooltip,
  Button,
  Link,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/CallMissed';
import CallMissed from '@material-ui/icons/Clear';
import AttachFile from '@material-ui/icons/AttachFile';
import TouchApp from '@material-ui/icons/TouchApp';
import Forum from '@material-ui/icons/Forum';
import Warning from '@material-ui/icons/Warning';
import axios from '../../../../../utils/axios';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardIcon from '../../../components/Card/CardIcon';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import GridItem from '../../../components/Grid/GridItem';
import CustomButton from '../../../components/CustomButtons/Button';
// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import SuccessTypography from '../../../components/Typography/Success';
import DangerTypography from '../../../components/Typography/Danger';
import InfoTypography from '../../../components/Typography/Info';
import ReasonDialog from './ReasonDialog';
import UploadDialog from './UploadDialog';
import HOST from '../../../../../config';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
  },
  titleBar: {
    opacity: 0.95,
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    fontWeight: 'bold',
    marginRight: '10px',
  },
  customButton: {
    fontSize: '20px',
    padding: 'auto',
  },
}));

const BannerIcon = (props) => {
  const {
    confirmState, alarm, banner, handleDelete, handleReason, cols,
  } = props;
  // 진행중인 State
  if (confirmState === 0) {
    return (
      <InfoTypography>
        <Forum />
        {'진행중 '}
        {alarm && (
        <Button
          variant="contained"
          color="secondary"
          style={{
            marginLeft: '5px',
          }}
          onClick={handleDelete && handleDelete(banner)}
        >
        심의취소
        </Button>
        )}
      </InfoTypography>
    );
    // 승인된 State
  } if (confirmState === 1 || confirmState === 3) {
    return (
      <SuccessTypography>
        <Check />
        {'승인'}
      </SuccessTypography>
    );
    // 거절된 State
  }
  return (
    <DangerTypography>
      <Clear />
      {'거절'}
      {alarm
        ? (
          <Button
            variant="contained"
            color="secondary"
            style={{
              marginLeft: '5px',
            }}
            onClick={handleDelete && handleDelete(banner)}
          >
          배너삭제
          </Button>
        )
        : (
          cols !== 3 && (
          <Button
            component={Link}
            style={{
              color: '#AFAFAF', marginLeft: '5px',
            }}
            underline="always"
            onClick={handleReason && handleReason(banner)}
          >
          거절사유확인
          </Button>
          )
        )
      }
    </DangerTypography>
  );
};


const BannerGridList = (props) => {
  const {
    bannerList, cols, alarm, handleDelete, handleReason,
  } = props;
  const imageClasses = useStyles();
  const gridStyle = (cols === 3 ? {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  } : {});
  return (
    <GridList
      cols={cols}
      style={gridStyle}
    >
      {bannerList.map(banner => (
        <GridListTile key={banner.bannerId} style={{ height: '250px' }}>
          <img src={banner.bannerSrc} alt={banner.bannerId} />
          <GridListTileBar
            classes={{
              root: imageClasses.titleBar,
              actionIcon: imageClasses.icon,
            }}
            actionIcon={(
              <BannerIcon
                confirmState={banner.confirmState}
                alarm={alarm}
                banner={banner}
                handleDelete={handleDelete}
                handleReason={handleReason}
                cols={cols}
              />
            )}
          />
        </GridListTile>
      ))}
    </GridList>
  );
};

const BannerManage = (props) => {
  const { classes } = props;
  const [bannerList, setBannerList] = useState([]);
  const [ApprovedList, setApprovedList] = useState([]);
  const [RejectedList, setRejectedList] = useState([]);
  const [OngoingList, setOngoingList] = useState([]);
  const [RejectedAlarm, setRejected] = useState(false);
  const [OngoingAlarm, setOngoing] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedBanner, setBanner] = useState({});
  const [upload, setUpload] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleUpload = () => {
    setUpload(!upload);
  };

  const readyBanner = useCallback(() => {
    axios.get(`${HOST}/api/dashboard/marketer/banner/all`)
      .then((res) => {
        if (res.data[0]) {
          const completeBanners = [];
          const failureBanners = [];
          const continueBanners = [];
          res.data[1].map((banner) => {
            if (banner.confirmState === 0) {
              continueBanners.push(banner);
            } else if (banner.confirmState === 1 || banner.confirmState === 3) {
              completeBanners.push(banner);
            } else {
              failureBanners.push(banner);
            }
            return null;
          });
          setApprovedList(completeBanners);
          setRejectedList(failureBanners);
          setOngoingList(continueBanners);
          setBannerList(res.data[1]);
        }
      });
  }, []);

  useEffect(() => {
    readyBanner();
  }, [readyBanner]);

  const handleAlarm = target => () => {
    if (target === 'ongoing') {
      setOngoing(!OngoingAlarm);
    } else {
      setRejected(!RejectedAlarm);
    }
  };

  const handleDelete = banner => () => {
    console.log('배너를 삭제합니다');
    const { bannerId } = banner;
    axios.post(`${HOST}/api/dashboard/marketer/banner/delete`, { bannerId })
      .then((res) => {
        alert(res.data[1]);
        if (res.data[0]) {
          readyBanner();
        } else {
          console.log('에러가 떴습니다');
        }
      });
  };

  const handleReason = banner => () => {
    console.log('배너의 사유를 보여줍니다');
    const { bannerDenialReason, date, bannerSrc } = banner;
    console.log(typeof (date));
    let newdate = new Date(date);
    newdate = newdate.toLocaleString();
    setBanner({ bannerDenialReason, date: newdate, bannerSrc });
    handleOpen();
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={8}>
        <Card>
          <CardHeader color="blueGray" stats>
            <h4 className={classes.cardTitleWhite}>등록한 배너</h4>
            <p className={classes.cardCategoryWhite}>등록된 모든 배너를 보여줍니다.</p>
          </CardHeader>
          <CardBody>
            {bannerList.length === 0
              ? (
                <DangerTypography>
                  <Warning />
                  {'승인된  배너가 없어요!'}
                </DangerTypography>
              )
              : <BannerGridList bannerList={bannerList} cols={3} />
            }
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={6} md={4}>
        <Card>
          <CardHeader color="blueGray" stats icon>
            <CardIcon color="blueGray">
              <AttachFile />
            </CardIcon>
            <p className={classes.cardCategory}>지금바로 배너를 등록하세요</p>
            <h3 className={classes.cardTitle}>
            배너 등록하기
            </h3>
          </CardHeader>
          <CardBody style={{
            margin: '30px auto',
            padding: 'auto',
            itemAlign: 'center',
          }}
          >
            <CustomButton round color="info" size="lg" onClick={handleUpload}>등록</CustomButton>
          </CardBody>
          <CardFooter stats />
        </Card>
      </GridItem>
      <GridItem xs={12} sm={6} md={4}>
        <Card>
          <CardHeader color="info" stats icon>
            <CardIcon color="info">
              <Forum />
            </CardIcon>
            <p className={classes.cardCategory}>광고 심의중인 배너</p>
            <h3 className={classes.cardTitle}>
            진행중인 배너
            </h3>
          </CardHeader>
          <CardBody>
            <BannerGridList bannerList={OngoingList} cols={1} alarm={OngoingAlarm} handleDelete={handleDelete} />
          </CardBody>
          <CardFooter stats>
            <Tooltip title="취소할 배너를 고르세요.">
              <Button style={{ alignItems: 'center' }} onClick={handleAlarm('ongoing')}>
                <InfoTypography><CallMissed /></InfoTypography>
                <span className={classes.infoText}>심의취소</span>
              </Button>
            </Tooltip>
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={6} md={4}>
        <Card>
          <CardHeader color="success" stats icon>
            <CardIcon color="success">
              <Check />
            </CardIcon>
            <p className={classes.cardCategory}>심의가 완료된 배너</p>
            <h3 className={classes.cardTitle}>
            완료된 배너
            </h3>
          </CardHeader>
          <CardBody>
            <BannerGridList bannerList={ApprovedList} cols={1} />
          </CardBody>
          <CardFooter stats>
            <Tooltip title="대시보드로 광고를 시작하러 이동합니다.">
              <Button style={{ alignItems: 'center' }}>
                <SuccessTypography><TouchApp /></SuccessTypography>
                <span className={classes.successText}>광고시작하기</span>
              </Button>
            </Tooltip>
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={6} md={4}>
        <Card>
          <CardHeader color="danger" stats icon>
            <CardIcon color="danger">
              <Clear />
            </CardIcon>
            <p className={classes.cardCategory}>심의가 거절된 배너</p>
            <h3 className={classes.cardTitle}>
            거절된 배너
            </h3>
          </CardHeader>
          <CardBody>
            <BannerGridList bannerList={RejectedList} cols={1} alarm={RejectedAlarm} handleDelete={handleDelete} handleReason={handleReason} />
          </CardBody>
          <CardFooter stats>
            <Tooltip title="삭제할 배너를 고르세요.">
              {RejectedAlarm ? (
                <Button style={{ alignItems: 'center' }} onClick={handleAlarm('rejected')}>
                  <DangerTypography><CallMissed /></DangerTypography>
                  <span className={classes.dangerText} name="ongoing">취소</span>
                </Button>
              ) : (
                <Button style={{ alignItems: 'center' }} onClick={handleAlarm('rejected')}>
                  <DangerTypography><CallMissed /></DangerTypography>
                  <span className={classes.dangerText} name="ongoing">배너삭제</span>
                </Button>
              )}
            </Tooltip>
          </CardFooter>
        </Card>
      </GridItem>
      <ReasonDialog open={open} handleOpen={handleOpen} banner={selectedBanner} />
      <UploadDialog open={upload} handleOpen={handleUpload} readyBanner={readyBanner} />
    </GridContainer>
  );
};

export default withStyles(dashboardStyle)(BannerManage);
