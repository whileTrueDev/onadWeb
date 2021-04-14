import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import RemotePageOpenButton from '../RemotePage/sub/RemotePageOpenButton';
import history from '../../../../history';
import { UseGetRequestObject } from '../../../../utils/hooks/useGetRequest';
import OnadBanner from '../../../../atoms/Banner/OnadBanner';
import { CurrentBannerRes } from '../CampaignManage/NowBroadCard';
import { Link } from '../CampaignManage/BannerList';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(4), marginTop: theme.spacing(1), height: 280, overflowY: 'auto'
  },
  bold: { fontWeight: 'bold' },
  section: { marginTop: theme.spacing(2) },
  bannerContainer: { display: 'flex', alignItems: 'center' },
  bannerItem: { maxHeight: '160px', maxWidth: '320px', },
  area: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    [theme.breakpoints.down('xs')]: { minHeight: 100 },
  },
  right: { textAlign: 'right' },
  moreButton: {
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline', }
  },
  head: { fontWeight: 700 },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'block'
    }
  },
  remoteOpenButtonContainer: {
    [theme.breakpoints.down('xs')]: { marginTop: theme.spacing(1) },
  },
  bannerLink: {
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
}));
interface BannerCardProps {
  currentBannerData: CurrentBannerRes[];
  remoteControllerUrlData: UseGetRequestObject<string>;
}
function BannerCard({
  currentBannerData,
  remoteControllerUrlData,
}: BannerCardProps): JSX.Element {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      {/* 제목 */}
      <div className={classes.title}>
        <div>
          <Typography className={classes.bold}>
          현재 송출중인 배너광고
          </Typography>
          <Typography variant="caption">
          내 광고관리 탭에서 자세히 확인할 수 있습니다.
          </Typography>
        </div>

        {/* 실시간 광고 제어 버튼 */}
        <div className={classes.remoteOpenButtonContainer}>
          <RemotePageOpenButton remoteControllerUrl={remoteControllerUrlData} />
        </div>
      </div>

      <div className={classes.section}>
        {currentBannerData.length <= 0 && (
        <div className={classes.area}>
          <div style={{ textAlign: 'center' }}>
            <Typography variant="body1" className={classes.head}>
              매칭된 광고가 없습니다.
            </Typography>
            <Typography variant="body2" color="textSecondary">정확하게 표시되지 않을 수 있습니다.</Typography>
          </div>
        </div>
        )}
        {currentBannerData.map((bannerData) => (
          <Grid
            container
            spacing={2}
            key={bannerData.campaignDescription}
            className={classes.bannerContainer}
          >
            <Grid item xs={12} md={6} className={classes.bannerItem}>
              <OnadBanner
                src={bannerData.bannerSrc}
                alt="bannerArea"
                width="100%"
                height="100%"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Typography variant="body1" gutterBottom>
                {bannerData.campaignName}
              </Typography>
              {bannerData.merchandiseName ? (
                <Typography
                  className={classes.bannerLink}
                  onClick={() => {
                    if (bannerData.itemSiteUrl) window.open(bannerData.itemSiteUrl, '_blank');
                  }}
                >
                  {bannerData.merchandiseName}
                </Typography>
              ) : (
                <Typography
                  variant="body1"
                  component="a"
                  className={classes.bannerLink}
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
              )}
              <Typography variant="body2">
                {bannerData.campaignDescription}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </div>

      <div className={classes.right}>
        <Typography
          className={classes.moreButton}
          variant="caption"
          color="textSecondary"
          onClick={(): void => { history.push('/mypage/creator/ad/campaigns'); }}
        >
          자세히 보기
        </Typography>
      </div>
    </Paper>
  );
}

export default BannerCard;
