import moment from 'moment';
import { Divider, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import OnadBanner from '../../../../../atoms/Banner/OnadBanner';
import { CampaignInterface } from '../../dashboard/interfaces';
import renderPriorityType from '../../../../../utils/render_funcs/renderPriorityType';
import renderOptionType from '../../../../../utils/render_funcs/renderOptionType';
import TimeSelector from '../../../../../atoms/Selector/TimeSelector';

const useStyles = makeStyles((theme) => ({
  metaInfo: {
    display: 'flex',
  },
  title: {
    fontWeight: theme.typography.fontWeightBold
  }
}));

export interface CampaignDetailProps {
  selectedCampaign: CampaignInterface;
}
export default function CampaignDetail({
  selectedCampaign,
}: CampaignDetailProps): JSX.Element {
  const classes = useStyles();

  return (
    <div>
      {/* 캠페인 정보 */}
      <div id="meta-info" className={classes.metaInfo}>
        <OnadBanner src={selectedCampaign.bannerSrc} />

        <div style={{ marginLeft: 16 }}>
          <Typography variant="h5" className={classes.title}>
            {selectedCampaign.campaignName}
          </Typography>
          <Typography>
            {`${renderOptionType(selectedCampaign.optionType)}`}
          </Typography>
          <Typography>
            {`${renderPriorityType(selectedCampaign.priorityType)}`}
          </Typography>
          <Typography color="textSecondary">
            {`등록시간: ${moment(selectedCampaign.regiDate).format('YYYY/MM/DD HH:MM:SS')}`}
          </Typography>
        </div>
      </div>

      <div style={{ margin: '16px 0px', }}>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>상세 정보</Typography>
        <Typography style={{ fontWeight: 'bold' }}>캠페인 홍보 문구</Typography>
        <Typography>{selectedCampaign.campaignDescription}</Typography>

        <Typography style={{ fontWeight: 'bold' }}>일일 예산</Typography>
        <Typography>{`${(1000000).toLocaleString()} 원`}</Typography>

        <Typography style={{ fontWeight: 'bold' }}>송출 시간</Typography>
        <Typography>{selectedCampaign.selectedTime.join(', ')}</Typography>
        <TimeSelector timeList={selectedCampaign.selectedTime} />

        <Typography style={{ fontWeight: 'bold' }}>송출 목록</Typography>
        <Typography>{selectedCampaign.targetList}</Typography>
      </div>
      <Divider />

    </div>
  );
}
