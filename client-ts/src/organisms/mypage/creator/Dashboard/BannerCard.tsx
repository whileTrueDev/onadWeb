import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import history from '../../../../history';
import isVideo from '../../../../utils/isVideo';
import VideoBanner from '../../../../atoms/Banner/VideoBanner';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(4), marginTop: theme.spacing(1), height: 280, overflowY: 'auto'
  },
  bold: { fontWeight: 'bold' },
  section: { marginTop: theme.spacing(2) },
  bannerContainer: { display: 'flex', marginBottom: theme.spacing(2), alignItems: 'center' },
  bannerItem: { maxHeight: '160px', maxWidth: '320px', marginRight: theme.spacing(2) },
  area: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 150
  },
  right: { textAlign: 'right' },
  moreButton: {
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline', }
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
    <Paper className={classes.container}>
      {/* 제목 */}
      <div>
        <Typography className={classes.bold}>
          현재 송출중인 배너광고
        </Typography>
        <Typography variant="caption">
          내 배너광고 탭에서 자세히 확인할 수 있습니다.
        </Typography>
      </div>

      <div className={classes.section}>
        {currentBannerData.length <= 0 && (
        <div className={classes.area}>
          <Typography variant="body1" className={classes.head}>
            매칭된 광고가 없습니다.
          </Typography>
        </div>
        )}
        {currentBannerData.map((bannerData) => (
          <div
            key={bannerData.campaignDescription}
            className={classes.bannerContainer}
          >
            {isVideo(bannerData.bannerSrc) ? (
              <VideoBanner
                src={bannerData.bannerSrc}
                draggable={false}
                alt="bannerArea"
                width="100%"
                height="100%"
                className={classes.bannerItem}
              />
            ) : (
              <img
                src={bannerData.bannerSrc}
                draggable={false}
                alt="bannerArea"
                className={classes.bannerItem}
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
        ))}
      </div>

      <div className={classes.right}>
        <Typography
          className={classes.moreButton}
          variant="caption"
          color="textSecondary"
          onClick={(): void => { history.push('/mypage/creator/ad'); }}
        >
          자세히 보기
        </Typography>
      </div>
    </Paper>
  );
}

export default BannerCard;
