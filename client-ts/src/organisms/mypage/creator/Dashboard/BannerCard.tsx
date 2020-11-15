import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import history from '../../../../history';

const useStyles = makeStyles((theme: Theme) => ({
  area: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150
  },
  head: { fontWeight: 700 }
}));

export interface CurrentBannerRes {
  marketerName: string; bannerSrc: string;
  campaignName: string;
  campaignDescription: string;
}

interface BannerCardProps { currentBannerData: CurrentBannerRes[] }
function BannerCard({ currentBannerData }: BannerCardProps): JSX.Element {
  const classes = useStyles();

  return (
    <Paper style={{
      padding: 32, marginTop: 8, height: 280, overflowY: 'auto'
    }}
    >
      {/* 제목 */}
      <div>
        <Typography style={{ fontWeight: 'bold' }}>
          현재 송출중인 배너광고
        </Typography>
        <Typography variant="caption">
          내 배너광고 탭에서 자세히 확인할 수 있습니다.
        </Typography>
      </div>

      <div style={{ marginTop: 16 }}>
        {currentBannerData.length >= 0 && (
        <div className={classes.area}>
          <Typography variant="body1" className={classes.head}>
            매칭된 광고가 없습니다.
          </Typography>
        </div>
        )}
        {/* {currentBannerData.map((bannerData) => (
          <div
            key={bannerData.campaignDescription}
            style={{ display: 'flex', marginBottom: 16, alignItems: 'center' }}
          >
            {isVideo(bannerData.bannerSrc) ? (
              <VideoBanner
                src={bannerData.bannerSrc}
                draggable={false}
                alt="bannerArea"
                width="100%"
                height="100%"
                style={{ maxHeight: '160px', maxWidth: '320px', marginRight: 16 }}
              />
            ) : (
              <img
                src={bannerData.bannerSrc}
                draggable={false}
                alt="bannerArea"
                style={{ maxHeight: '160px', maxWidth: '320px', marginRight: 16 }}
              />
            )}
            <div>
              <Typography variant="body1" gutterBottom>
                {bannerData.campaignName}
              </Typography>
              <Typography variant="body2">
                {bannerData.campaignDescription}
              </Typography>
            </div>
          </div>
        ))} */}
      </div>

      <div style={{ textAlign: 'right', margin: '16px 8px 8px', overflowY: 'auto' }}>
        <Typography
          variant="caption"
          color="textSecondary"
          onClick={(): void => { history.push('/mypage/creator/banner'); }}
        >
          자세히 보기
        </Typography>
      </div>
    </Paper>
  );
}

export default BannerCard;
