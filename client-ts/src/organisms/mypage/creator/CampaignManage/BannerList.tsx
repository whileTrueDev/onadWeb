import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Fragment } from 'react';
import OnadBanner from '../../../../atoms/Banner/OnadBanner';
import { useCreatorBannerList } from '../../../../utils/hooks/query/useCreatorBannerList';

const useStyles = makeStyles(theme => ({
  container: { marginBottom: theme.spacing(4) },
  linkTitle: {
    textDecoration: 'underline',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.light,
    },
  },
  campaign: { margin: theme.spacing(0, 1, 4, 1) },
  campaignSrc: { marginBottom: theme.spacing(1), width: '100%' },
  campaignImage: { maxWidth: 400, maxHeight: 200 },
  campaignDesc: { display: 'flex', marginBottom: theme.spacing(1), maxWidth: 320 },
  marketerLogo: { margin: theme.spacing(1, 1, 0, 0.5) },
  desc: { marginTop: theme.spacing(1) },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 200,
    alignItems: 'center',
  },
  moreButton: { textAlign: 'center' },
}));

export interface Link {
  primary: boolean;
  linkTo: string;
  linkName: string;
}
export interface BannerStarted {
  campaignId: string;
  date: string;
  bannerSrc: string;
  creatorId: string;
  state: number;
  marketerName: string;
  connectedLinkId: string;
  links: string;
  cash: number;
  CPC: number;
  CPM: number;
  targetList: string; // "{"targetList":["무관"]}"
  campaignDescription: string;
  optionType: number;
  priorityType: number;
  profileImage?: string;
  itemSiteUrl?: string;
  merchandiseId?: string;
  merchandiseName?: string;
}
export default function BannerList(): JSX.Element {
  const classes = useStyles();
  // 광고 타입 렌더링 함수
  function renderOptionType(option: number): string {
    // {/* optionType : 캠페인의 광고타입 ( 0: CPM, 1: CPM + CPC, 2: CPC ) */}
    let str = '';
    if (option === 0) str = '배너광고';
    if (option === 1) str = '배너+클릭광고';
    if (option === 2) str = '클릭광고';
    if (option === 3) str = '상품판매광고';
    return str;
  }
  // 캠페인목록 크기
  const bannerList = useCreatorBannerList({ page: 0 });

  return (
    <Grid container spacing={1} className={classes.container}>
      {/* 아직 없는 경우 처리 */}
      {!bannerList.isLoading && (!bannerList.data || bannerList.data.pages.length < 1) && (
        <Grid item xs={12} style={{ marginTop: 8 }}>
          <Typography>아직 진행한 광고가 없습니다.</Typography>
        </Grid>
      )}
      {/* 목록 */}
      <Grid item xs={12} container>
        {bannerList.data &&
          bannerList.data.pages.map((campaignList, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={idx}>
              {campaignList.banners.map(campaign => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={campaign.campaignId}>
                  <div className={classes.campaign}>
                    <div className={classes.campaignSrc}>
                      <OnadBanner
                        src={campaign.bannerSrc}
                        alt=""
                        width="100%"
                        height="100%"
                        className={classes.campaignImage}
                      />
                    </div>
                    <div className={classes.campaignDesc}>
                      <Avatar src={campaign.profileImage} className={classes.marketerLogo} />
                      <div>
                        <Chip
                          size="small"
                          label={campaign.state ? '현재진행중' : '광고종료'}
                          color={campaign.state ? 'primary' : 'default'}
                        />
                        <div>
                          {/* LIVE 배너 광고의 랜딩페이지 링크 */}
                          {campaign.links &&
                            JSON.parse(campaign.links).links.map((link: Link) => (
                              <span key={link.linkName}>
                                {link.primary && (
                                  <Typography
                                    component="span"
                                    color="textPrimary"
                                    className={classes.linkTitle}
                                    onClick={() => window.open(link.linkTo, '_blank')}
                                  >
                                    {' '}
                                    {link.linkName}
                                  </Typography>
                                )}
                              </span>
                            ))}
                          {/* 판매형 광고의 경우 상품 판매 링크 */}
                          {!campaign.links && campaign.merchandiseId && campaign.itemSiteUrl && (
                            <Typography
                              component="span"
                              color="textPrimary"
                              className={classes.linkTitle}
                              onClick={() => window.open(campaign.itemSiteUrl, '_blank')}
                            >
                              {campaign.merchandiseName}
                            </Typography>
                          )}
                        </div>
                        <Typography variant="caption" color="textSecondary">
                          {`${campaign.marketerName},첫게시: ${campaign.date}`}
                        </Typography>
                        <Typography color="textPrimary" variant="body2">
                          {`배너광고 ${campaign.CPM.toLocaleString()}원 • 클릭광고 ${campaign.CPC.toLocaleString()}원`}
                        </Typography>
                        <Typography color="textPrimary" variant="body2">
                          {`${renderOptionType(campaign.optionType)}`}
                        </Typography>
                        <div className={classes.desc}>
                          <Typography color="textPrimary" variant="body2">
                            {campaign.campaignDescription}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
              ))}
            </Fragment>
          ))}
      </Grid>

      {/* 로딩 */}
      {(bannerList.isFetching || bannerList.isFetchingNextPage) && (
        <Grid item xs={12} className={classes.loading}>
          <CircularProgress />
          <Typography>광고 목록 로딩중입니다.</Typography>
        </Grid>
      )}

      {/* 더보기 버튼 */}
      {bannerList.hasNextPage && !bannerList.isFetchingNextPage && (
        <Grid item xs={12}>
          <div className={classes.moreButton}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={(): void => {
                bannerList.fetchNextPage({
                  pageParam: 1,
                });
              }}
            >
              더보기
            </Button>
          </div>
        </Grid>
      )}
    </Grid>
  );
}
