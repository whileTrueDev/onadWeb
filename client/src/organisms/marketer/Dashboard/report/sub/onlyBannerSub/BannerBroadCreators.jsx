import React from 'react';
import {
  Grid, Avatar, Typography
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

import CardTemplate from '../common/CardTemplate';
import CreatorInfo from './CreatorInfo';

export default function BannerBroadCreators(props) {
  const { creatorsData, ...rest } = props;

  // For creator menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dataindex, setDataIndex] = React.useState(0);

  const handleClick = (event, index) => {
    setDataIndex(index);
    setAnchorEl(event.currentTarget);
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

            {!creatorsData.loading && (
            <CreatorInfo
              creatorInfo={creatorsData.payload[dataindex]}
              anchorEl={anchorEl}
              handleClose={handleClose}
            />
            )}
          </Grid>
        </CardTemplate>
      )}
    </div>
  );
}
