import React from 'react';
import { Divider, Avatar } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  container: {
    padding: 12, minWidth: 420
  },
  spaceBetween: {
    display: 'flex', justifyContent: 'space-between', padding: 4
  },
  flex: {
    display: 'flex', alignItems: 'center'
  },
  nodetails: {
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

export default function CreatorInfo(props) {
  const classes = useStyles();
  const { anchorEl, handleClose, creatorInfo } = props;

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <div className={classes.container}>
        <div className={classes.spaceBetween}>
          <div className={classes.flex}>
            <Avatar
              src={creatorInfo.creatorLogo}
            />
            <Typography gutterBottom variant="h6">
              &emsp;
              {creatorInfo.creatorName}
            </Typography>
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.open(`https://twitch.tv/${creatorInfo.creatorTwitchId}`);
              handleClose();
            }}
          >
            채널 방문
          </Button>
        </div>
        <Divider />

        {creatorInfo.content ? (
          <div className={classes.flex} style={{ marginTop: 10 }}>
            <div>
              {/* 크리에이터 정보 */}
              <Typography gutterBottom variant="body1">
              주 컨텐츠 :&emsp;
              </Typography>
              <Typography gutterBottom variant="body1">
              팔로워 수 :&emsp;
              </Typography>
              <Typography gutterBottom variant="body1">
              평균 시청자 :&emsp;
              </Typography>
              <Typography gutterBottom variant="body1">
              총 배너 노출량 :&emsp;
              </Typography>
              <Typography gutterBottom variant="body1">
              평균 방송 시간대 :&emsp;
              </Typography>
              <Typography gutterBottom variant="body1">
              총 배너 송출 시간 :&emsp;
              </Typography>
            </div>

            <div>
              {/* 크리에이터 정보 */}
              <Typography gutterBottom variant="body1">
                {creatorInfo.content
                  ? creatorInfo.content
                  : '준비중입니다.'}
              </Typography>
              <Typography gutterBottom variant="body1">
                {creatorInfo.followers
                  ? `${creatorInfo.followers} 명`
                  : '준비중입니다.'}
              </Typography>
              <Typography gutterBottom variant="body1">
                {creatorInfo.viewer
                  ? `${creatorInfo.viewer} 명`
                  : '준비중입니다.'}
              </Typography>
              <Typography gutterBottom variant="body1">
                {creatorInfo.impression
                  ? `${creatorInfo.impression} 회`
                  : '준비중입니다.'}
              </Typography>
              <Typography gutterBottom variant="body1">
                {creatorInfo.openHour
                  ? creatorInfo.openHour
                  : '준비중입니다.'}
              </Typography>
              <Typography gutterBottom variant="body1">
                {creatorInfo.airtime
                  ? `${creatorInfo.airtime} 시간`
                  : '준비중입니다.'}
              </Typography>
            </div>
          </div>
        ) : (
          <div className={classes.nodetails}>
            <Typography variant="body1">해당 크리에이터는 </Typography>
            <Typography variant="body1">아직 분석할 데이터가 부족합니다.</Typography>
          </div>
        )}


      </div>
    </Popover>
  );
}
