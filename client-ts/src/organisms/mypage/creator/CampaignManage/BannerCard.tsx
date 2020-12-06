import {
  Button,
  Chip,
  CircularProgress,
  Grid, Paper, Typography,
} from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import VideoBanner from '../../../../atoms/Banner/VideoBanner';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
import HOST from '../../../../config';
import axiosInstance from '../../../../utils/axios';
import isVideo from '../../../../utils/isVideo';

export interface Link {primary: boolean; linkTo: string; linkName: string}
export interface CampaignData {
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
}
export default function BannerCard(): JSX.Element {
  // 광고 타입 렌더링 함수
  function renderOptionType(option: number): string {
    // {/* optionType : 캠페인의 광고타입 ( 0: CPM, 1: CPM + CPC, 2: CPC ) */}
    let str = '';
    if (option === 0) str = '배너광고';
    if (option === 1) str = '배너+클릭광고';
    if (option === 2) str = '클릭광고';
    return str;
  }
  // 에러 스낵바
  const [errorSnack, setErrorSnack] = useState(false);
  function handleErrorSnackOpen(): void {
    setErrorSnack(false);
  }
  // 캠페인목록 크기
  const OFFSET = 4;
  // 로딩
  const [loading, setLoading] = useState<boolean>(false);
  // 데이터
  const [data, setData] = useState<CampaignData[]>([]);
  // 요청 페이지
  const [page, setPage] = useState(0);
  function handleNextPage(): void {
    setPage((p) => p + 1);
  }
  const request = useCallback((): void => {
    setLoading(true);
    axiosInstance.get<CampaignData[]>(
      `${HOST}/creator/banner/list`, { params: { offset: OFFSET, page } }
    )
      .then((res) => {
        setLoading(false);
        setData((prev) => prev.concat(res.data));
      })
      .catch(() => {
        setLoading(false);
        setErrorSnack(true);
      });
  }, [page]);

  useEffect(() => {
    request();
  }, [request]);


  return (
    <Grid container spacing={1} style={{ marginBottom: 32 }}>

      <Grid item xs={12}>
        <Typography style={{ fontWeight: 'bold' }}>내가 진행한 광고 목록</Typography>
      </Grid>
      {/* 목록 */}
      {data.map((campaign) => (
        <Grid item xs={12} sm={6} lg={3} key={campaign.campaignId}>
          <Paper style={{ padding: 32, height: 350, overflowY: 'auto' }}>
            <div>
              <div style={{ maxHeight: 160, maxWidth: 320, }}>
                {isVideo(campaign.bannerSrc) ? (
                  <VideoBanner
                    src={campaign.bannerSrc}
                    draggable={false}
                    alt="bannerArea"
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <img
                    src={campaign.bannerSrc}
                    draggable={false}
                    alt="bannerArea"
                    width="100%"
                    height="100%"
                  />
                )}
              </div>

              <div style={{ marginLeft: 8 }}>
                <div>
                  {campaign.links && JSON.parse(campaign.links).links.map((link: Link) => (
                    <>
                      {link.primary && (
                      <Typography
                        component="span"
                        key={link.linkName}
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={(): void => { window.open(link.linkTo); }}
                      >
                        {' '}
                        {link.linkName}
                      </Typography>
                      )}
                    </>
                  ))}
                  &nbsp;
                  <Chip
                    size="small"
                    label={campaign.state ? '현재진행중' : '광고종료'}
                    color={campaign.state ? 'primary' : 'default'}
                  />
                </div>
                <Typography variant="caption" color="textSecondary">{`광고 첫 게시 ${campaign.date}`}</Typography>
                <Typography variant="body2">{`배너광고 ${campaign.CPM.toLocaleString()}원 • 클릭광고 ${campaign.CPC.toLocaleString()}원`}</Typography>
                <Typography variant="body2">{`${renderOptionType(campaign.optionType)}`}</Typography>
                <div style={{ marginTop: 8 }}>
                  <Typography variant="body2">{campaign.campaignDescription}</Typography>
                </div>
                {/* priorityType : 배너 광고 우선순위 타입 ( 0: 크리에이터 우선형, 1: 카테고리 우선형 2: 노출 우선형) */}
              </div>
            </div>
          </Paper>
        </Grid>
      ))}

      {/* 로딩 */}
      {loading && (
      <Grid
        item
        xs={12}
        style={{
          display: 'flex', justifyContent: 'center', height: 200, alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Grid>
      )}

      {/* 더보기 버튼 */}
      {data.length % OFFSET === 0 && (
      <Grid item xs={12}>
        <div style={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={(): void => {
              handleNextPage();
            }}
          >
            더보기
          </Button>
        </div>
      </Grid>
      )}

      <Snackbar
        open={errorSnack}
        message="진행 광고 목록을 불러오는 도중 오류가 발생했습니다."
        color="error"
        onClose={handleErrorSnackOpen}
      />
    </Grid>
  );
}
