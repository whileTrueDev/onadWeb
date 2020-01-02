import React from 'react';
import {
  Grid, Avatar, Typography
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CardTemplate from '../common/CardTemplate';
import CreatorInfo from '../common/CreatorInfo';
import axios from '../../../../../../utils/axios';
import HOST from '../../../../../../utils/config';
// import CreatorInfo from './CreatorInfo';

export default function BannerBroadCreators(props) {
  const { creatorsData, ...rest } = props;

  // For creator menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [detailData, setDetail] = React.useState({
    loading: true,
    empty: false,
    payload: {}
  });

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    // creatorsData의 특정 데이터를 로드할 수 있다.
    const { creatorId } = creatorsData.payload[index];
    axios.post(`${HOST}/api/dashboard/marketer/report/detail`, { creatorId })
      .then((res) => {
        // 빈 것일 수도 있고 꽉 차있을 수 있다.
        const rawDetailData = res.data;
        // 데이터가 존재하지 않을경우, 에러처리
        // javascript object empty check
        if (Object.entries(rawDetailData).length === 0 && rawDetailData.constructor === Object) {
          setDetail({
            loading: false,
            empty: true,
            payload: {
              ...creatorsData.payload[index]
            }
          });
        } else {
          setDetail({
            loading: false,
            empty: false,
            payload: {
              ...rawDetailData,
              ...creatorsData.payload[index]
            }
          });
        }
      });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div {...rest}>
      {creatorsData.payload.length === 0 ? (
        null
      ) : (
        <CardTemplate title="배너 송출 크리에이터" color="secondary" IconComponent={AccountCircle}>
          <Grid container style={{ height: 380, overflow: 'auto' }} id="broad-creators">
            <Grid item container direction="column">
              <Typography variant="caption">* 송출량 순 상위 50명까지의 크리에이터 목록입니다.</Typography>
              <Typography variant="caption">* 크리에이터 클릭 시, 상세정보를 볼 수 있습니다.</Typography>
            </Grid>
            {creatorsData.payload.slice(0, 50).map((creator, index) => (
              <Grid key={creator.creatorName} item xs={6} md={4} lg={3} style={{ padding: 8 }}>
                <Avatar
                  src={creator.creatorLogo}
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={(e) => { handleClick(e, index); }}
                />
                <Typography variant="body1">{`${index + 1}. ${creator.creatorName}`}</Typography>
              </Grid>
            ))}

            {!detailData.loading && (
            <CreatorInfo
              creatorInfo={detailData.payload}
              anchorEl={anchorEl}
              handleClose={handleClose}
              empty={detailData.empty}
            />
            )}
          </Grid>
        </CardTemplate>
      )}
    </div>
  );
}
