import { Avatar, Button, Grid, Hidden, makeStyles, Paper, Typography } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import OnadBanner from '../../../../atoms/Banner/OnadBanner';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import { useCreatorBannerActive } from '../../../../utils/hooks/query/useCreatorBannerActive';
import RemotePageOpenButton from '../RemotePage/sub/RemotePageOpenButton';
import { Link } from './BannerList';

dayjs.extend(relativeTime);

const useStyles = makeStyles(theme => ({
  container: {
    height: 200,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('xs')]: { minHeight: 320 },
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    height: 200,
    alignItems: 'center',
  },
  bold: { fontWeight: 'bold' },
  section: { marginTop: theme.spacing(2) },
  bannerContainer: { display: 'flex' },
  bannerImgWrapper: { maxHeight: '160px', maxWidth: '320px' },
  area: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  head: { fontWeight: 700 },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  bannerLink: {
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  marketerLogo: { marginRight: theme.spacing(1) },
}));

export default function NowBroadCard(): JSX.Element {
  const classes = useStyles();
  const currentBanner = useCreatorBannerActive();

  return (
    <Paper className={classes.container}>
      {/* 제목 */}
      <div className={classes.title}>
        <Typography className={classes.bold}>현재 송출중인 배너광고</Typography>

        {/* 실시간 광고 제어 버튼 */}
        <div>
          <Hidden xsDown>
            <Button
              style={{ marginRight: 4 }}
              size="small"
              variant="outlined"
              color="primary"
              onClick={(): void => {
                currentBanner.refetch();
              }}
            >
              <Refresh />
              새로고침
            </Button>
          </Hidden>
          <RemotePageOpenButton />
        </div>
      </div>

      <div className={classes.section}>
        {currentBanner.isLoading && <CenterLoading />}

        {currentBanner.data && currentBanner.data.length <= 0 && (
          <div className={classes.area}>
            <div style={{ textAlign: 'center' }}>
              <Typography variant="body1" className={classes.head}>
                매칭된 광고가 없습니다.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                정확하게 표시되지 않을 수 있습니다.
              </Typography>
            </div>
          </div>
        )}
        {!currentBanner.isLoading &&
          currentBanner.data &&
          currentBanner.data.slice(0, 1).map(bannerData => (
            <Grid
              container
              spacing={2}
              key={bannerData.campaignDescription}
              className={classes.bannerContainer}
            >
              <Grid item xs={12} sm={6} className={classes.bannerImgWrapper}>
                <OnadBanner
                  src={bannerData.bannerSrc}
                  width="100%"
                  height="100%"
                  alt="bannerArea"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={bannerData.profileImage} className={classes.marketerLogo} />
                  <Typography variant="body2">{bannerData.marketerName}</Typography>
                </div>
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
                        window.open(
                          JSON.parse(bannerData.links).links.find((link: Link) => !!link.primary)
                            .linkTo,
                        );
                      }
                    }}
                  >
                    {JSON.parse(bannerData.links).links
                      ? JSON.parse(bannerData.links).links.find((link: Link) => !!link.primary)
                          .linkName
                      : bannerData.campaignName}
                  </Typography>
                )}
                <Typography variant="body2">
                  {bannerData.campaignDescription.length > 50
                    ? `${bannerData.campaignDescription.slice(0, 50)}...`
                    : bannerData.campaignDescription}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`${dayjs(bannerData.date).fromNow()}`}
                </Typography>
              </Grid>
            </Grid>
          ))}
      </div>
    </Paper>
  );
}
