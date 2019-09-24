import React, { useEffect, useState, useCallback } from 'react';
// for Link tag component
// @material-ui/core
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Button,
  Link,
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/CallMissed';
import Forum from '@material-ui/icons/Forum';
import Warning from '@material-ui/icons/Warning';
import axios from '../../../../../utils/axios';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import GridItem from '../../../components/Grid/GridItem';
import CustomButton from '../../../components/CustomButtons/Button';
import Table from '../../../components/Table/Table';
// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import SuccessTypography from '../../../components/Typography/Success';
import DangerTypography from '../../../components/Typography/Danger';
import InfoTypography from '../../../components/Typography/Info';
import UploadDialog from './UploadDialog';
import HOST from '../../../../../config';
import history from '../../../../../history';

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


const CustomTable = (props) => {
  const { BannerList, handleDelete, classes } = props;
  return (
    <GridContainer>
      <Table
        tableHead={['캠페인', '배너 이미지', '심의결과', '기타']}
        tableData={BannerList}
      />


    </GridContainer>
  );
};

const BannerGridList = (props) => {
  const {
    BannerList, cols, alarm, handleDelete, handleReason,
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
      {BannerList.map(banner => (
        <GridListTile key={banner.bannerId} style={{ height: 'auto', maxHeight: '200px' }}>
          <img src={banner.bannerSrc} alt={banner.bannerId} style={{ maxWidth: '100%', height: '100%' }} />
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
  const [BannerList, setBannerList] = useState([]);
  const [open, setOpen] = useState(false);
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
        if (res.data) {
          res.data[1].map((banner) => {
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
          setBannerList(res.data[1]);
        }
      });
  }, []);

  useEffect(() => {
    readyBanner();
  }, [readyBanner]);

  const handleDelete = banner => () => {
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

  const handleRedirect = () => {
    history.push('/dashboard/marketer/main');
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={10}>
        <Card>
          <CardHeader color="blueGray" stats>
            <h4 className={classes.cardTitleWhite}>배너 리스트</h4>
            <p className={classes.cardCategoryWhite}>등록된 모든 배너를 보여줍니다.</p>
          </CardHeader>
          <CardBody>
            <CustomButton round color="info" size="lg" onClick={handleUpload}>
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
                  handleDelete={handleDelete}
                />
              )
          }
          </CardBody>
        </Card>
      </GridItem>
      <UploadDialog open={upload} handleOpen={handleUpload} readyBanner={readyBanner} />
    </GridContainer>

  );
};

export default withStyles(dashboardStyle)(BannerManage);
