import {
  ButtonBase, Grid, Paper, Typography
} from '@material-ui/core';
import React from 'react';

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
export interface BannerCardProps {
  campaignData: CampaignData[];
}
export default function BannerCard({
  campaignData,
}: BannerCardProps): JSX.Element {
  function renderOptionType(option: number): string {
    // {/* optionType : 캠페인의 광고타입 ( 0: CPM, 1: CPM + CPC, 2: CPC ) */}
    let str = '';
    if (option === 0) str = '배너광고';
    if (option === 1) str = '배너+클릭광고';
    if (option === 2) str = '클릭광고';
    return str;
  }
  return (
    <Grid container spacing={1}>
      {campaignData.map((campaign) => (
        <Grid item xs={4} key={campaign.campaignId}>
          <Paper style={{ padding: 32, height: 350 }}>
            <div>
              <div style={{ maxHeight: 160, maxWidth: 320, }}>
                <img src={campaign.bannerSrc} alt="" style={{ height: '100%', width: '100%' }} />
              </div>

              <div style={{ marginLeft: 8 }}>
                {/* <Typography>{`campaignId: ${campaign.campaignId}`}</Typography> */}
                {/* <Typography>{`bannerSrc: ${campaign.bannerSrc}`}</Typography> */}
                {/* <Typography>{`creatorId: ${campaign.creatorId}`}</Typography> */}
                {/* <Typography>{`connectedLinkId: ${campaign.connectedLinkId}`}</Typography> */}
                {campaign.links && JSON.parse(campaign.links).links.map((link: Link) => (
                  <>
                    {link.primary && (
                    <Typography
                      key={link.linkName}
                      style={{ textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={() => window.open(link.linkTo)}
                    >
                      {' '}
                      {link.linkName}
                    </Typography>
                    )}
                  </>
                ))}
                <Typography>{`광고주명 ${campaign.marketerName}`}</Typography>
                <Typography>{campaign.state ? '진행중' : '완료됨'}</Typography>
                <Typography variant="caption" color="textSecondary">{`date: ${campaign.date}`}</Typography>
                <Typography>{`cash, cpm, cpc: ${campaign.cash}, ${campaign.CPM}, ${campaign.CPC}`}</Typography>
                <Typography>{campaign.campaignDescription}</Typography>
                {/* <Typography>{`targetList: ${campaign.targetList}`}</Typography> */}
                <Typography>{`광고 타입 ${renderOptionType(campaign.optionType)}`}</Typography>
                {/* <Typography>{`priorityType: ${campaign.priorityType}`}</Typography> */}
                {/* priorityType : 배너 광고 우선순위 타입 ( 0: 크리에이터 우선형, 1: 카테고리 우선형 2: 노출 우선형) */}
              </div>
            </div>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
