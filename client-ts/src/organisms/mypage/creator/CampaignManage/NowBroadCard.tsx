import {
  CircularProgress, makeStyles, Paper, Typography
} from '@material-ui/core';
import React from 'react';
import VideoBanner from '../../../../atoms/Banner/VideoBanner';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';
import isVideo from '../../../../utils/isVideo';
import { Link } from './BannerCard';

const useStyles = makeStyles((theme) => ({
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
  head: { fontWeight: 700 },
}));


export interface CurrentBannerRes {
  marketerName: string;
  bannerSrc: string;
  campaignName: string;
  campaignDescription: string;
  links: string;
  regiDate: string;
}
export interface NowBroadCardProps {
  currentBannerGet: UseGetRequestObject<CurrentBannerRes[]>;
}
export default function NowBroadCard({
  currentBannerGet
}: NowBroadCardProps): JSX.Element {
  const classes = useStyles();

  return (
    <Paper style={{
      height: 200, padding: 32, marginBottom: 16,
    }}
    >
      {/* 제목 */}
      <div>
        <Typography className={classes.bold}>
          현재 송출중인 배너광고
        </Typography>
      </div>

      <div className={classes.section}>
        {currentBannerGet.loading && (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress />
        </div>
        )}

        {currentBannerGet.data && currentBannerGet.data.length <= 0 && (
        <div className={classes.area}>
          <div style={{ textAlign: 'center' }}>
            <Typography variant="body1" className={classes.head}>
              매칭된 광고가 없습니다.
            </Typography>
            <Typography variant="body2" color="textSecondary">정확하게 표시되지 않을 수 있습니다.</Typography>
          </div>
        </div>
        )}
        {currentBannerGet.data
        && currentBannerGet.data
          .slice(0, 1)
          .map((bannerData) => (
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
                <Typography
                  variant="body1"
                  style={{ fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={(): void => {
                    if (JSON.parse(bannerData.links).links) {
                      window.open(JSON.parse(bannerData.links).links
                        .find((link: Link) => !!link.primary).linkTo);
                    }
                  }}
                >
                  {JSON.parse(bannerData.links).links
                    ? JSON.parse(bannerData.links).links
                      .find((link: Link) => !!link.primary).linkName
                    : bannerData.campaignName}
                </Typography>
                <Typography variant="body2">
                  {bannerData.campaignDescription}
                </Typography>
                <Typography variant="body2" />
              </div>
            </div>
          ))}
      </div>
    </Paper>
  );
}
