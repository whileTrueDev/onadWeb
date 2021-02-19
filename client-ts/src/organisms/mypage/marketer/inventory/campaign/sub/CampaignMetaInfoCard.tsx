
import moment from 'moment';
import {
  Chip, makeStyles, Paper, Typography
} from '@material-ui/core';
import React from 'react';
import OnadBanner from '../../../../../../atoms/Banner/OnadBanner';
import renderOptionType from '../../../../../../utils/render_funcs/renderOptionType';
import renderPriorityType from '../../../../../../utils/render_funcs/renderPriorityType';
import { CampaignInterface } from '../../../dashboard/interfaces';

const useStyles = makeStyles((theme) => ({
  metaInfo: {
    maxWidth: 320,
    marginBottom: theme.spacing(1),
  },
  title: {
    fontWeight: theme.typography.fontWeightBold
  },
  contents: {
    padding: theme.spacing(1, 2),
  }
}));

export interface CampaignMetaInfoCardProps {
  campaign: CampaignInterface;
}
export default function CampaignMetaInfoCard({
  campaign
}: CampaignMetaInfoCardProps): JSX.Element {
  const classes = useStyles();
  return (
    <Paper id="meta-info" className={classes.metaInfo} variant="outlined">
      <OnadBanner src={campaign.bannerSrc} width="100%" height="100%" />

      <div className={classes.contents}>
        <Chip
          size="small"
          label={campaign.onOff ? '활성화상태' : '비활성화상태'}
          color={campaign.onOff ? 'primary' : 'default'}
        />
        <Typography className={classes.title}>
          {campaign.campaignName}
        </Typography>
        <Typography>
          {`${renderOptionType(campaign.optionType)}`}
        </Typography>
        <Typography>
          {`${renderPriorityType(campaign.priorityType)}`}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {`등록시간: ${moment(campaign.regiDate).format('YYYY/MM/DD HH:MM:SS')}`}
        </Typography>
      </div>

    </Paper>
  );
}
